export const OTHER_ASSETS = [
  { id: "PPF", label: "PPF" },
  { id: "NPS", label: "NPS" },
  { id: "EPF", label: "EPF / Provident fund" },
  { id: "SSY", label: "Sukanya Samriddhi" },
  { id: "NSC", label: "National Savings Certificate" },
  { id: "KVP", label: "Kisan Vikas Patra" },
  { id: "SGB", label: "Sovereign Gold Bond" },
  { id: "BTC", label: "Bitcoin" },
  { id: "ETH", label: "Ethereum" },
  { id: "CRYPTO", label: "Other crypto" },
  { id: "PROPERTY", label: "Property / real estate" },
  { id: "ESOP", label: "ESOP / RSUs" },
  { id: "RECEIVABLE", label: "Loan given / receivable" },
  { id: "CUSTOM", label: "Other — type a name" },
] as const;

export type OtherAssetId = (typeof OTHER_ASSETS)[number]["id"];

export function otherAssetById(id: string | undefined) {
  if (!id) return undefined;
  return OTHER_ASSETS.find((row) => row.id === id);
}

export function otherAssetFromHolding(name: string, ticker?: string) {
  const byTicker = otherAssetById(ticker?.trim().toUpperCase());
  if (byTicker) return byTicker;
  const n = name.trim().toLowerCase();
  return OTHER_ASSETS.find((row) => row.label.toLowerCase() === n);
}
