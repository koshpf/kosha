import { mergeEarn, type EarnConfig } from "@/lib/earn";
import {
  activeFrom,
  normalizeVault,
  wrapAsVaults,
  type MemberVault,
} from "@/lib/member-vaults";
import type { PersistStorage, StorageValue } from "zustand/middleware";
import type { Holding, HistoryPoint, MarketQuotes } from "@/lib/types";
import { normalizeHolding } from "@/lib/types";

export const VAULT_KEY = "kosha-portfolio-v1";
const IDB_NAME = "kosha-vault";
const IDB_STORE = "kv";

export type VaultPayload = {
  vaults: MemberVault[];
  activeVaultId: string;
  holdings: Holding[];
  history: HistoryPoint[];
  lastPrices: MarketQuotes | null;
  theme: "dark" | "light";
  showUsd: boolean;
  seeded: boolean;
  earn: EarnConfig;
};

export type PersistedVault = Omit<VaultPayload, "lastPrices">;

export type KoshaBackupFile = {
  app: "kosha";
  version: 1 | 2;
  exportedAt: string;
} & VaultPayload;

function isHolding(value: unknown): value is Holding {
  if (!value || typeof value !== "object") return false;
  const row = value as Holding;
  return (
    typeof row.id === "string" &&
    typeof row.name === "string" &&
    typeof row.type === "string" &&
    typeof row.quantity === "number"
  );
}

function ledgerFromSource(source: {
  holdings?: unknown;
  history?: unknown;
  vaults?: unknown;
  activeVaultId?: unknown;
  seeded?: unknown;
}): { vaults: MemberVault[]; activeVaultId: string; holdings: Holding[]; history: HistoryPoint[]; seeded: boolean } {
  const parsedVaults = Array.isArray(source.vaults)
    ? source.vaults.map(normalizeVault).filter((row): row is MemberVault => row != null)
    : [];
  const holdings = Array.isArray(source.holdings) ? source.holdings.filter(isHolding).map(normalizeHolding) : [];
  const history = Array.isArray(source.history) ? (source.history as HistoryPoint[]) : [];
  const seeded = source.seeded !== false;
  if (parsedVaults.length > 0) {
    const activeVaultId =
      typeof source.activeVaultId === "string" && parsedVaults.some((row) => row.id === source.activeVaultId)
        ? source.activeVaultId
        : parsedVaults[0].id;
    const active = activeFrom(parsedVaults, activeVaultId);
    return {
      vaults: parsedVaults,
      activeVaultId,
      holdings: active.holdings,
      history: active.history,
      seeded: active.seeded,
    };
  }
  const wrapped = wrapAsVaults(holdings, history, seeded);
  return { ...wrapped, holdings, history, seeded };
}

export function parseVault(raw: string): VaultPayload {
  const data = JSON.parse(raw) as Partial<KoshaBackupFile> & { state?: { holdings?: unknown } };
  const source = Array.isArray(data.holdings) || Array.isArray(data.vaults)
    ? data
    : data.state && (Array.isArray(data.state.holdings) || Array.isArray((data.state as { vaults?: unknown }).vaults))
      ? data.state
      : null;
  if (!source) {
    throw new Error("Not a Kosha backup");
  }
  const ledger = ledgerFromSource(source as { holdings?: unknown });
  if (ledger.vaults.every((row) => row.holdings.length === 0) && Array.isArray((source as { holdings?: unknown[] }).holdings) && (source as { holdings: unknown[] }).holdings.length > 0) {
    throw new Error("Backup holdings look invalid");
  }
  return {
    ...ledger,
    lastPrices: (source as VaultPayload).lastPrices ?? null,
    theme: (source as VaultPayload).theme === "light" ? "light" : "dark",
    showUsd: (source as VaultPayload).showUsd !== false,
    earn: mergeEarn((source as VaultPayload).earn),
  };
}

export function serializeBackup(payload: VaultPayload): string {
  const file: KoshaBackupFile = {
    app: "kosha",
    version: 2,
    exportedAt: new Date().toISOString(),
    ...payload,
  };
  return JSON.stringify(file, null, 2);
}

export function downloadBackup(json: string) {
  const stamp = new Date().toLocaleDateString("en-GB").replace(/\//g, "-");
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `kosha-backup-${stamp}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function openIdb(): Promise<IDBDatabase | null> {
  if (typeof indexedDB === "undefined") return Promise.resolve(null);
  return new Promise((resolve) => {
    try {
      const req = indexedDB.open(IDB_NAME, 1);
      req.onupgradeneeded = () => {
        if (!req.result.objectStoreNames.contains(IDB_STORE)) {
          req.result.createObjectStore(IDB_STORE);
        }
      };
      req.onsuccess = () => resolve(req.result);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbGet(name: string): Promise<StorageValue<PersistedVault> | null> {
  const db = await openIdb();
  if (!db) return null;
  return new Promise((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readonly");
      const req = tx.objectStore(IDB_STORE).get(name);
      req.onsuccess = () => resolve((req.result as StorageValue<PersistedVault> | undefined) ?? null);
      req.onerror = () => resolve(null);
    } catch {
      resolve(null);
    }
  });
}

async function idbSet(name: string, value: StorageValue<PersistedVault>): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).put(value, name);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

async function idbDel(name: string): Promise<void> {
  const db = await openIdb();
  if (!db) return;
  await new Promise<void>((resolve) => {
    try {
      const tx = db.transaction(IDB_STORE, "readwrite");
      tx.objectStore(IDB_STORE).delete(name);
      tx.oncomplete = () => resolve();
      tx.onerror = () => resolve();
    } catch {
      resolve();
    }
  });
}

let persistTimer: ReturnType<typeof setTimeout> | undefined;
let persistQueued: { name: string; value: StorageValue<PersistedVault> } | null = null;

function writeNow(name: string, value: StorageValue<PersistedVault>) {
  try {
    localStorage.setItem(name, JSON.stringify(value));
  } catch {
    /* quota / private */
  }
  void idbSet(name, value);
}

export function writeVaultSync(payload: PersistedVault) {
  const value: StorageValue<PersistedVault> = { state: payload, version: 0 };
  persistQueued = null;
  if (persistTimer) {
    clearTimeout(persistTimer);
    persistTimer = undefined;
  }
  writeNow(VAULT_KEY, value);
}

function flushPersist() {
  persistTimer = undefined;
  const queued = persistQueued;
  persistQueued = null;
  if (queued) writeNow(queued.name, queued.value);
}

if (typeof window !== "undefined") {
  window.addEventListener("pagehide", flushPersist);
}

export const vaultPersistStorage: PersistStorage<PersistedVault> = {
  getItem: async (name) => {
    try {
      const raw = localStorage.getItem(name);
      if (raw) {
        const parsed = JSON.parse(raw) as StorageValue<PersistedVault>;
        void idbSet(name, parsed);
        return parsed;
      }
    } catch {
      /* private mode / blocked */
    }
    return idbGet(name);
  },
  setItem: (name, value) => {
    persistQueued = { name, value };
    if (persistTimer) return;
    persistTimer = setTimeout(flushPersist, 450);
  },
  removeItem: (name) => {
    persistQueued = null;
    if (persistTimer) {
      clearTimeout(persistTimer);
      persistTimer = undefined;
    }
    try {
      localStorage.removeItem(name);
    } catch {
      /* ignore */
    }
    void idbDel(name);
  },
};
