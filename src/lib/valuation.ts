import { FALLBACK_MARKET } from "@/lib/fallback-prices";
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

export function seedHistory(
  currentInr: number,
  market: MarketQuotes,
  days = 60,
): HistoryPoint[] {
  const goldPx = market.goldInrPerGram24k || FALLBACK_MARKET.goldInrPerGram24k;
  const btcPx = market.btcInr || FALLBACK_MARKET.btcInr;
  const points: HistoryPoint[] = [];
  const start = currentInr * 0.86;
  for (let i = days; i >= 0; i -= 1) {
    const t = (days - i) / days;
    const wave = Math.sin(i / 5.5) * 0.012 + Math.sin(i / 13) * 0.008;
    const drift = t * 0.14;
    const wobble = ((i * 17) % 10) / 10 * 0.01 - 0.005;
    let inr = start * (1 + drift + wave + wobble);
    if (i === 0) inr = currentInr;
    const date = new Date();
    date.setHours(18, 0, 0, 0);
    date.setDate(date.getDate() - i);
    const goldOff = 1 + Math.sin(i / 9) * 0.015;
    const btcOff = 1 + Math.sin(i / 7 + 1.2) * 0.04;
    points.push({
      date: todayKey(date),
      inr,
      goldG: inr / (goldPx * goldOff),
      btc: inr / (btcPx * btcOff),
    });
  }
  return points;
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

export function yesterdayPoint(history: HistoryPoint[]): HistoryPoint | undefined {
  const today = todayKey();
  const prior = history.filter((row) => row.date < today);
  return prior[prior.length - 1];
}
