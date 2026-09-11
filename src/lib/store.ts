import { create } from "zustand";
import { persist } from "zustand/middleware";
import { EMPTY_EARN, mergeEarn, type EarnConfig } from "@/lib/earn";
import {
  activeFrom,
  createVault,
  defaultSelfVault,
  wrapAsVaults,
  type MemberRole,
  type MemberVault,
} from "@/lib/member-vaults";
import { SAMPLE_HOLDINGS } from "@/lib/sample-holdings";
import type { Holding, HistoryPoint, MarketQuotes } from "@/lib/types";
import { normalizeHolding } from "@/lib/types";
import { VAULT_KEY, vaultPersistStorage, writeVaultSync, type VaultPayload } from "@/lib/vault";

export type ThemeMode = "dark" | "light";

type PortfolioState = VaultPayload & {
  hasHydrated: boolean;
  ensureSeeded: () => void;
  setHydrated: () => void;
  addHolding: (holding: Holding) => void;
  updateHolding: (id: string, patch: Partial<Holding>) => void;
  removeHolding: (id: string) => void;
  setPrices: (prices: MarketQuotes) => void;
  setHistory: (history: HistoryPoint[]) => void;
  setTheme: (theme: ThemeMode) => void;
  setShowUsd: (show: boolean) => void;
  setEarn: (earn: EarnConfig) => void;
  switchVault: (id: string) => void;
  addVault: (role: MemberRole, name?: string) => string;
  renameVault: (id: string, name: string) => void;
  removeVault: (id: string) => void;
  importVault: (payload: VaultPayload) => void;
  snapshot: () => VaultPayload;
  resetLedger: () => void;
};

function applyActive(vaults: MemberVault[], activeVaultId: string) {
  const active = activeFrom(vaults, activeVaultId);
  return {
    vaults,
    activeVaultId: active.id,
    holdings: active.holdings,
    history: active.history,
    seeded: active.seeded,
  };
}

function writeActive(vaults: MemberVault[], activeVaultId: string, patch: Partial<MemberVault>) {
  const next = vaults.map((row) => (row.id === activeVaultId ? { ...row, ...patch } : row));
  return applyActive(next, activeVaultId);
}

export const usePortfolio = create<PortfolioState>()(
  persist(
    (set, get) => ({
      vaults: [defaultSelfVault()],
      activeVaultId: "vlt_self",
      holdings: [],
      history: [],
      lastPrices: null,
      theme: "dark",
      showUsd: true,
      seeded: false,
      earn: { ...EMPTY_EARN },
      hasHydrated: false,
      ensureSeeded: () => {
        const { seeded, holdings, vaults, activeVaultId } = get();
        if (seeded) return;
        if (holdings.length > 0) {
          set(writeActive(vaults, activeVaultId, { seeded: true }));
          return;
        }
        set(writeActive(vaults, activeVaultId, { holdings: SAMPLE_HOLDINGS, seeded: true }));
      },
      setHydrated: () => set({ hasHydrated: true }),
      addHolding: (holding) => {
        const s = get();
        set(writeActive(s.vaults, s.activeVaultId, { holdings: [...s.holdings, holding], seeded: true }));
        persistSnapshot();
      },
      updateHolding: (id, patch) => {
        const s = get();
        set(
          writeActive(s.vaults, s.activeVaultId, {
            holdings: s.holdings.map((row) =>
              row.id === id ? { ...row, ...patch, updatedAt: Date.now() } : row,
            ),
            seeded: true,
          }),
        );
        persistSnapshot();
      },
      removeHolding: (id) => {
        const s = get();
        set(
          writeActive(s.vaults, s.activeVaultId, {
            holdings: s.holdings.filter((row) => row.id !== id),
            seeded: true,
          }),
        );
        persistSnapshot();
      },
      setPrices: (prices) =>
        set({
          lastPrices: {
            ...prices,
            quotes: { ...(get().lastPrices?.quotes ?? {}), ...prices.quotes },
          },
        }),
      setHistory: (history) => {
        const s = get();
        set(writeActive(s.vaults, s.activeVaultId, { history }));
      },
      setTheme: (theme) => set({ theme }),
      setShowUsd: (showUsd) => set({ showUsd }),
      setEarn: (earn) => {
        set({ earn: mergeEarn(earn) });
        persistSnapshot();
      },
      switchVault: (id) => {
        const s = get();
        if (!s.vaults.some((row) => row.id === id)) return;
        set(applyActive(s.vaults, id));
        persistSnapshot();
      },
      addVault: (role, name) => {
        const vault = createVault(role, name);
        const s = get();
        const vaults = [...s.vaults, vault];
        set({ ...applyActive(vaults, vault.id) });
        persistSnapshot();
        return vault.id;
      },
      renameVault: (id, name) => {
        const trimmed = name.trim();
        if (!trimmed) return;
        const s = get();
        set({ vaults: s.vaults.map((row) => (row.id === id ? { ...row, name: trimmed } : row)) });
        persistSnapshot();
      },
      removeVault: (id) => {
        const s = get();
        if (s.vaults.length < 2) return;
        const vaults = s.vaults.filter((row) => row.id !== id);
        const nextId = s.activeVaultId === id ? vaults[0].id : s.activeVaultId;
        set(applyActive(vaults, nextId));
        persistSnapshot();
      },
      importVault: (payload) => {
        const ledger = payload.vaults?.length
          ? applyActive(payload.vaults, payload.activeVaultId)
          : applyActive(
              writeActive(get().vaults, get().activeVaultId, {
                holdings: payload.holdings,
                history: payload.history,
                seeded: true,
              }).vaults,
              get().activeVaultId,
            );
        set({
          ...ledger,
          lastPrices: payload.lastPrices,
          theme: payload.theme,
          showUsd: payload.showUsd,
          earn: mergeEarn(payload.earn),
        });
        persistSnapshot();
      },
      snapshot: () => {
        const s = get();
        return {
          vaults: s.vaults,
          activeVaultId: s.activeVaultId,
          holdings: s.holdings,
          history: s.history,
          lastPrices: s.lastPrices,
          theme: s.theme,
          showUsd: s.showUsd,
          seeded: s.seeded,
          earn: s.earn,
        };
      },
      resetLedger: () => {
        const s = get();
        set(writeActive(s.vaults, s.activeVaultId, { holdings: [], history: [], seeded: true }));
        persistSnapshot();
      },
    }),
    {
      name: VAULT_KEY,
      storage: vaultPersistStorage,
      skipHydration: true,
      merge: (persistedState, currentState) => {
        if (currentState.seeded && currentState.holdings.length > 0 && currentState.vaults.length > 0) {
          return currentState;
        }
        const persisted = persistedState as Partial<VaultPayload> | undefined;
        const holdings = Array.isArray(persisted?.holdings)
          ? persisted.holdings.map(normalizeHolding)
          : currentState.holdings;
        const history = Array.isArray(persisted?.history) ? persisted.history : currentState.history;
        const seeded = persisted?.seeded ?? currentState.seeded;
        const fromVaults = Array.isArray(persisted?.vaults) && persisted.vaults.length > 0
          ? applyActive(
              persisted.vaults,
              typeof persisted.activeVaultId === "string" ? persisted.activeVaultId : persisted.vaults[0].id,
            )
          : { ...wrapAsVaults(holdings, history, Boolean(seeded)), holdings, history, seeded: Boolean(seeded) };
        return {
          ...currentState,
          ...(persisted as object),
          ...fromVaults,
          holdings: fromVaults.holdings,
          earn: mergeEarn(persisted?.earn ?? currentState.earn),
        };
      },
      partialize: (state) => ({
        vaults: state.vaults,
        activeVaultId: state.activeVaultId,
        holdings: state.holdings,
        history: state.history,
        theme: state.theme,
        showUsd: state.showUsd,
        seeded: state.seeded,
        earn: state.earn,
      }),
    },
  ),
);

export function applyTheme(theme: ThemeMode) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  root.classList.toggle("dark", theme === "dark");
  root.classList.toggle("light", theme === "light");
  root.style.colorScheme = theme;
}

function persistSnapshot() {
  const s = usePortfolio.getState();
  writeVaultSync({
    vaults: s.vaults,
    activeVaultId: s.activeVaultId,
    holdings: s.holdings,
    history: s.history,
    theme: s.theme,
    showUsd: s.showUsd,
    seeded: s.seeded,
    earn: s.earn,
  });
}
