import { useMemo } from "react";
import { FALLBACK_MARKET } from "@/lib/fallback-prices";
import { usePortfolio } from "@/lib/store";
import {
  aggregate,
  realHistory,
  valueHolding,
  yesterdayPoint,
} from "@/lib/valuation";

export function usePortfolioView() {
  const holdings = usePortfolio((s) => s.holdings);
  const stored = usePortfolio((s) => s.lastPrices);
  const history = usePortfolio((s) => s.history);
  const hasHydrated = usePortfolio((s) => s.hasHydrated);
  const market = stored ?? FALLBACK_MARKET;

  const views = useMemo(
    () => holdings.map((holding) => valueHolding(holding, market)),
    [holdings, market],
  );

  const yesterday = useMemo(() => yesterdayPoint(history), [history]);

  const totals = useMemo(
    () => aggregate(views, market, yesterday),
    [views, market, yesterday],
  );

  return { holdings, views, totals, market, history, hasHydrated, yesterday };
}

export function syncHistoryFromTotals() {
  const { history, lastPrices, holdings, setHistory } = usePortfolio.getState();
  if (holdings.length === 0) {
    if (history.length) setHistory([]);
    return;
  }
  const market = lastPrices ?? FALLBACK_MARKET;
  const views = holdings.map((holding) => valueHolding(holding, market));
  const totals = aggregate(views, market, yesterdayPoint(history));
  const next = realHistory(history, holdings, totals);
  const prev = history[history.length - 1];
  const last = next[next.length - 1];
  if (
    prev &&
    last &&
    prev.date === last.date &&
    Math.abs(prev.inr - last.inr) < 1 &&
    history.length === next.length &&
    history[0]?.date === next[0]?.date
  ) {
    return;
  }
  setHistory(next);
}
