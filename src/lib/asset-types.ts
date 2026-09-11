import type { AssetType } from "@/lib/types";

export type AssetTypeMeta = {
  id: AssetType;
  label: string;
  shortLabel: string;
  hint: string;
  group: string;
  quoted: boolean;
  manual: boolean;
};

export const ASSET_TYPES: AssetTypeMeta[] = [
  {
    id: "indian_stock",
    label: "Indian stock",
    shortLabel: "IN stock",
    hint: "NSE / BSE ticker",
    group: "Markets",
    quoted: true,
    manual: false,
  },
  {
    id: "us_stock",
    label: "US / international stock",
    shortLabel: "US stock",
    hint: "NYSE, Nasdaq, and others",
    group: "Markets",
    quoted: true,
    manual: false,
  },
  {
    id: "indian_mf",
    label: "Indian mutual fund",
    shortLabel: "Mutual fund",
    hint: "Scheme name or AMFI code",
    group: "Markets",
    quoted: true,
    manual: false,
  },
  {
    id: "etf",
    label: "ETF",
    shortLabel: "ETF",
    hint: "India or US listed",
    group: "Markets",
    quoted: true,
    manual: false,
  },
  {
    id: "physical_gold",
    label: "Physical gold",
    shortLabel: "Gold",
    hint: "Grams, 22K or 24K",
    group: "Hard assets",
    quoted: true,
    manual: true,
  },
  {
    id: "ulip",
    label: "ULIP",
    shortLabel: "ULIP",
    hint: "Tata AIA, HDFC Life, ICICI Pru and others",
    group: "Insurance",
    quoted: true,
    manual: false,
  },
  {
    id: "usd_cash",
    label: "USD / foreign currency",
    shortLabel: "FX cash",
    hint: "USD, Euro, Pound and others",
    group: "Cash",
    quoted: true,
    manual: false,
  },
  {
    id: "bank",
    label: "Bank account",
    shortLabel: "Bank",
    hint: "Savings or current balance",
    group: "Cash",
    quoted: false,
    manual: true,
  },
  {
    id: "rd",
    label: "Recurring deposit",
    shortLabel: "RD",
    hint: "Current RD value",
    group: "Deposits",
    quoted: false,
    manual: true,
  },
  {
    id: "fd",
    label: "Fixed deposit",
    shortLabel: "FD",
    hint: "Principal and current value",
    group: "Deposits",
    quoted: false,
    manual: true,
  },
  {
    id: "other",
    label: "Other",
    shortLabel: "Other",
    hint: "PPF, NPS, crypto, property",
    group: "Other",
    quoted: false,
    manual: true,
  },
];

export const ASSET_TYPE_MAP: Record<AssetType, AssetTypeMeta> = Object.fromEntries(
  ASSET_TYPES.map((item) => [item.id, item]),
) as Record<AssetType, AssetTypeMeta>;

export function typeLabel(type: AssetType): string {
  return ASSET_TYPE_MAP[type].label;
}

export function typeShortLabel(type: AssetType): string {
  return ASSET_TYPE_MAP[type].shortLabel;
}
