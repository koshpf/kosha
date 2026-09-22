import { inrPerFx } from "@/lib/fx";
import { todayKey } from "@/lib/format";
import { mfCode, mfQuoteKey, ulipCode, yahooSymbol } from "@/lib/symbols";
import { ulipQuoteKey } from "@/lib/ulip-index";
import type {
  HistoryPoint,
  Holding,
  HoldingView,
  MarketQuotes,
  PortfolioTotals,
} from "@/lib/types";

export function goldPriceForPurity(market: MarketQuotes, purity: 22 | 24 = 24): number {
  return market.goldInrPerGram24k * (purity / 24);
}

export function valueHolding(holding: Holding, market: MarketQuotes): HoldingView {
  const costBasisInr = holding.costBasisInr;
  let currentValueInr = 0;
  let pricePerUnit: number | null = null;
  let priceCurrency: HoldingView["priceCurrency"] = null;
  let dayChangeInr = 0;
  let quoted = false;

  const ySym = yahooSymbol(holding);
  const code = mfCode(holding);
  const uCode = ulipCode(holding);
  const quote = ySym
    ? market.quotes[ySym]
    : code
      ? market.quotes[mfQuoteKey(code)]
      : uCode
        ? market.quotes[ulipQuoteKey(uCode)]
        : undefined;

  switch (holding.type) {
    case "indian_stock":
    case "etf":
    case "us_stock":
    case "indian_mf":
    case "ulip": {
      if (quote) {
        quoted = true;
        pricePerUnit = quote.price;
        priceCurrency = quote.currency;
        const fx = quote.currency === "USD" ? market.usdInr : 1;
        currentValueInr = holding.quantity * quote.price * fx;
        if (quote.prevClose != null) {
          dayChangeInr = holding.quantity * (quote.price - quote.prevClose) * fx;
        }
      } else if (holding.manualValueInr != null) {
        currentValueInr = holding.manualValueInr;
      } else {
        const fx = holding.currency === "USD" ? market.usdInr : 1;
        currentValueInr = holding.quantity * holding.avgPrice * fx;
        pricePerUnit = holding.avgPrice;
        priceCurrency = holding.currency === "USD" ? "USD" : "INR";
      }
      break;
    }
    case "physical_gold": {
      const purity = holding.purity ?? 24;
      const livePerGram = goldPriceForPurity(market, purity);
      pricePerUnit = livePerGram;
      priceCurrency = "INR";
      quoted = holding.manualValueInr == null;
      if (holding.manualValueInr != null) {
        currentValueInr = holding.manualValueInr;
      } else {
        currentValueInr = holding.quantity * livePerGram;
      }
      break;
    }
    case "usd_cash": {
      const rate = inrPerFx(market, holding.currency);
      pricePerUnit = rate;
      priceCurrency = "INR";
      quoted = rate > 0;
      currentValueInr = holding.quantity * rate;
      break;
    }
    case "bank":
    case "rd":
    case "fd":
    case "other": {
      currentValueInr =
        holding.manualValueInr ??
        (holding.quantity > 0 && holding.avgPrice > 0
          ? holding.quantity * holding.avgPrice
          : costBasisInr);
      break;
    }
  }

  const pnlInr = currentValueInr - costBasisInr;
  const pnlPct = costBasisInr !== 0 ? (pnlInr / costBasisInr) * 100 : 0;

  return {
    holding,
    currentValueInr,
    costBasisInr,
    pnlInr,
    pnlPct,
    dayChangeInr,
    pricePerUnit,
    priceCurrency,
    lastUpdated: quoted ? market.asOf : holding.updatedAt,
    quoted,
    quoteAsOf: quote?.asOf,
  };
}

export function aggregate(
  views: HoldingView[],
  market: MarketQuotes,
  yesterday?: HistoryPoint,
): PortfolioTotals {
  const currentInr = views.reduce((sum, row) => sum + row.currentValueInr, 0);
  const costInr = views.reduce((sum, row) => sum + row.costBasisInr, 0);
  const quotedDay = views.reduce((sum, row) => sum + row.dayChangeInr, 0);
  const dayChangeInr =
    yesterday && yesterday.date !== todayKey() ? currentInr - yesterday.inr : quotedDay;
  const pnlInr = currentInr - costInr;
  const goldGrams = market.goldInrPerGram24k > 0 ? currentInr / market.goldInrPerGram24k : 0;
  const btc = market.btcInr > 0 ? currentInr / market.btcInr : 0;
  const usd = market.usdInr > 0 ? currentInr / market.usdInr : 0;

  return {
    currentInr,
    costInr,
    pnlInr,
    pnlPct: costInr !== 0 ? (pnlInr / costInr) * 100 : 0,
    dayChangeInr,
    goldGrams,
    btc,
    usd,
  };
}

export function allocationByType(
  views: HoldingView[],
): { type: Holding["type"]; value: number }[] {
  const map = new Map<Holding["type"], number>();
  for (const row of views) {
    map.set(row.holding.type, (map.get(row.holding.type) ?? 0) + row.currentValueInr);
  }
  return [...map.entries()]
    .map(([type, value]) => ({ type, value }))
    .filter((row) => row.value > 0)
    .sort((a, b) => b.value - a.value);
}

export function firstHoldingDate(holdings: Holding[]): string | null {
  if (holdings.length === 0) return null;
  const ts = Math.min(...holdings.map((row) => row.createdAt || Date.now()));
  return todayKey(new Date(ts));
}

function previousDate(iso: string): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(y ?? 0, (m ?? 1) - 1, d ?? 1);
  dt.setDate(dt.getDate() - 1);
  return todayKey(dt);
}

export function upsertTodaySnapshot(
  history: HistoryPoint[],
  totals: PortfolioTotals,
): HistoryPoint[] {
  const date = todayKey();
  const point: HistoryPoint = {
    date,
    inr: totals.currentInr,
    goldG: totals.goldGrams,
    btc: totals.btc,
  };
  const without = history.filter((row) => row.date !== date);
  const next = [...without, point].sort((a, b) => a.date.localeCompare(b.date));
  return next.slice(-180);
}

/** Keep only days on/after the first holding. Invented backfill is dropped. */
export function realHistory(
  history: HistoryPoint[],
  holdings: Holding[],
  totals: PortfolioTotals,
): HistoryPoint[] {
  const start = firstHoldingDate(holdings);
  if (!start) return [];
  const kept = history.filter((row) => row.date >= start);
  const withToday = upsertTodaySnapshot(kept, totals);
  const origin = previousDate(start);
  if (withToday.some((row) => row.date <= origin)) return withToday;
  return [{ date: origin, inr: 0, goldG: 0, btc: 0 }, ...withToday].slice(-180);
}

export function yesterdayPoint(history: HistoryPoint[]): HistoryPoint | undefined {
  const today = todayKey();
  const prior = history.filter((row) => row.date < today);
  return prior[prior.length - 1];
}
