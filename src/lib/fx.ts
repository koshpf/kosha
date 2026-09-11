export const FX_CURRENCIES = [
  { code: "USD", name: "US Dollar" },
  { code: "EUR", name: "Euro" },
  { code: "GBP", name: "British Pound" },
  { code: "AED", name: "UAE Dirham" },
  { code: "SGD", name: "Singapore Dollar" },
  { code: "AUD", name: "Australian Dollar" },
  { code: "CAD", name: "Canadian Dollar" },
  { code: "CHF", name: "Swiss Franc" },
  { code: "JPY", name: "Japanese Yen" },
  { code: "HKD", name: "Hong Kong Dollar" },
  { code: "CNY", name: "Chinese Yuan" },
] as const;

export type FxCode = (typeof FX_CURRENCIES)[number]["code"];

/** INR per 1 unit — Sept 2026 stand-ins if the live table is down. */
export const FALLBACK_FX_RATES: Record<FxCode, number> = {
  USD: 95.12,
  EUR: 111.4,
  GBP: 128.2,
  AED: 25.9,
  SGD: 74.1,
  AUD: 63.2,
  CAD: 69.4,
  CHF: 118.6,
  JPY: 0.646,
  HKD: 12.22,
  CNY: 13.38,
};

export function isFxCode(value: string | undefined): value is FxCode {
  return FX_CURRENCIES.some((row) => row.code === value);
}

export function fxName(code: string): string {
  return FX_CURRENCIES.find((row) => row.code === code)?.name ?? code;
}

export function inrPerFx(
  market: { usdInr: number; fxRates?: Record<string, number> },
  code: string,
): number {
  if (!code || code === "INR") return 1;
  const live = market.fxRates?.[code];
  if (live && live > 0) return live;
  if (isFxCode(code)) return FALLBACK_FX_RATES[code];
  if (code === "USD") return market.usdInr;
  return 0;
}
