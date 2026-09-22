import type { FxCode } from "@/lib/fx";

export const ASSET_TYPE_IDS = [
  "indian_stock",
  "us_stock",
  "indian_mf",
  "etf",
  "physical_gold",
  "ulip",
  "usd_cash",
  "bank",
  "rd",
  "fd",
  "other",
] as const;

export type AssetType = (typeof ASSET_TYPE_IDS)[number];
export type QuoteCurrency = "INR" | "USD";
export type HoldingCurrency = "INR" | FxCode;
export type Exchange = "NSE" | "BSE" | "US";
export type GoldPurity = 22 | 24;
export type HistoryUnit = "inr" | "gold" | "btc";

export type Holding = {
  id: string;
  name: string;
  type: AssetType;
  ticker?: string;
  exchange?: Exchange;
  quantity: number;
  avgPrice: number;
  currency: HoldingCurrency;
  costBasisInr: number;
  purity?: GoldPurity;
  manualValueInr?: number;
  notes?: string;
  createdAt: number;
  updatedAt: number;
};

export type Quote = {
  price: number;
  prevClose?: number;
  currency: QuoteCurrency;
  name?: string;
  /** NAV date YYYY-MM-DD when known (AMFI). */
  asOf?: string;
};

export type MarketQuotes = {
  asOf: number;
  usdInr: number;
  fxRates: Record<string, number>;
  goldInrPerGram24k: number;
  goldUsdPerGram: number;
  btcInr: number;
  btcUsd: number;
  quotes: Record<string, Quote>;
  live: {
    fx: boolean;
    gold: boolean;
    btc: boolean;
  };
  usedDemo: boolean;
};

export type HistoryPoint = {
  date: string;
  inr: number;
  goldG: number;
  btc: number;
};

export function normalizeHolding(row: Holding): Holding {
  const rawType = row.type as string;
  if (rawType === "tata_aia") return { ...row, type: "ulip" };
  return row;
}

export type HoldingView = {
  holding: Holding;
  currentValueInr: number;
  costBasisInr: number;
  pnlInr: number;
  pnlPct: number;
  dayChangeInr: number;
  pricePerUnit: number | null;
  priceCurrency: QuoteCurrency | null;
  lastUpdated: number;
  quoted: boolean;
  quoteAsOf?: string;
};

export type PortfolioTotals = {
  currentInr: number;
  costInr: number;
  pnlInr: number;
  pnlPct: number;
  dayChangeInr: number;
  goldGrams: number;
  btc: number;
  usd: number;
};
