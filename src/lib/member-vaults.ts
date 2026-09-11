import type { HistoryPoint, Holding } from "@/lib/types";
import { normalizeHolding } from "@/lib/types";

export const MEMBER_ROLES = [
  { id: "self", label: "Myself" },
  { id: "spouse", label: "Spouse" },
  { id: "mother", label: "Mother" },
  { id: "father", label: "Father" },
  { id: "son", label: "Son" },
  { id: "daughter", label: "Daughter" },
  { id: "sibling", label: "Sibling" },
  { id: "grandparent", label: "Grandparent" },
  { id: "other", label: "Other family" },
] as const;

export type MemberRole = (typeof MEMBER_ROLES)[number]["id"];

export type MemberVault = {
  id: string;
  name: string;
  role: MemberRole;
  holdings: Holding[];
  history: HistoryPoint[];
  seeded: boolean;
};

export function isMemberRole(value: unknown): value is MemberRole {
  return MEMBER_ROLES.some((row) => row.id === value);
}

export function roleLabel(role: MemberRole): string {
  return MEMBER_ROLES.find((row) => row.id === role)?.label ?? "Family";
}

export function newVaultId(): string {
  return `vlt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export function createVault(role: MemberRole, name?: string): MemberVault {
  return {
    id: newVaultId(),
    name: name?.trim() || roleLabel(role),
    role,
    holdings: [],
    history: [],
    seeded: true,
  };
}

export function defaultSelfVault(holdings: Holding[] = [], history: HistoryPoint[] = [], seeded = false): MemberVault {
  return {
    id: "vlt_self",
    name: "Myself",
    role: "self",
    holdings,
    history,
    seeded,
  };
}

export function normalizeVault(raw: unknown): MemberVault | null {
  if (!raw || typeof raw !== "object") return null;
  const row = raw as Partial<MemberVault>;
  if (typeof row.id !== "string" || typeof row.name !== "string") return null;
  const holdings = Array.isArray(row.holdings) ? row.holdings.map(normalizeHolding) : [];
  return {
    id: row.id,
    name: row.name.trim() || "Family",
    role: isMemberRole(row.role) ? row.role : "other",
    holdings,
    history: Array.isArray(row.history) ? row.history : [],
    seeded: row.seeded !== false,
  };
}

export function wrapAsVaults(
  holdings: Holding[],
  history: HistoryPoint[],
  seeded: boolean,
): { vaults: MemberVault[]; activeVaultId: string } {
  const self = defaultSelfVault(holdings, history, seeded);
  return { vaults: [self], activeVaultId: self.id };
}

export function activeFrom(vaults: MemberVault[], activeVaultId: string): MemberVault {
  return vaults.find((row) => row.id === activeVaultId) ?? vaults[0] ?? defaultSelfVault();
}
