import { rankMutualFunds, MF_SEEDS } from "@/lib/mf-index";
import { ulipQuoteKey } from "@/lib/ulip-index";
import type { Holding } from "@/lib/types";

export function yahooSymbol(holding: Holding): string | null {
  const raw = holding.ticker?.trim().toUpperCase();
  if (!raw) return null;

  if (holding.type === "indian_stock" || (holding.type === "etf" && holding.exchange !== "US")) {
    if (raw.includes(".")) return raw;
    return holding.exchange === "BSE" ? `${raw}.BO` : `${raw}.NS`;
  }

  if (holding.type === "us_stock" || (holding.type === "etf" && holding.exchange === "US")) {
    return raw;
  }

  return null;
}

export function mfQuoteKey(code: string): string {
  return `MF:${code.trim()}`;
}

export function mfCode(holding: Holding): string | null {
  if (holding.type !== "indian_mf") return null;
  const ticker = holding.ticker?.trim() ?? "";
  if (/^\d{4,8}$/.test(ticker)) return ticker;
  const embedded = ticker.match(/\b(\d{6,8})\b/);
  if (embedded) return embedded[1];
  const query = `${ticker} ${holding.name ?? ""}`.trim();
  if (query.length < 4) return null;
  return rankMutualFunds(MF_SEEDS, query, 1)[0]?.code ?? null;
}

export function ulipCode(holding: Holding): string | null {
  if (holding.type !== "ulip") return null;
  const raw = holding.ticker?.trim().toUpperCase();
  if (raw && /^I[A-Z]{1,3}\d+$/.test(raw)) return raw;
  return null;
}

export function collectSymbols(holdings: Holding[]): {
  yahoo: string[];
  mf: string[];
  ulip: string[];
} {
  const yahoo = new Set<string>();
  const mf = new Set<string>();
  const ulip = new Set<string>();
  for (const holding of holdings) {
    const y = yahooSymbol(holding);
    if (y) yahoo.add(y);
    const code = mfCode(holding);
    if (code) mf.add(code);
    const u = ulipCode(holding);
    if (u) ulip.add(u);
  }
  return {
    yahoo: [...yahoo].slice(0, 40),
    mf: [...mf].slice(0, 40),
    ulip: [...ulip].slice(0, 20),
  };
}
