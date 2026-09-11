import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { FALLBACK_MARKET } from "@/lib/fallback-prices";
import { fetchMarketQuotes, fetchMfQuotes } from "@/lib/quotes";
import { collectSymbols } from "@/lib/symbols";
import { usePortfolio } from "@/lib/store";
import { syncHistoryFromTotals } from "@/lib/use-portfolio-view";

export function PriceSync() {
  const holdings = usePortfolio((s) => s.holdings);
  const hasHydrated = usePortfolio((s) => s.hasHydrated);
  const setPrices = usePortfolio((s) => s.setPrices);
  const symbols = useMemo(() => collectSymbols(holdings), [holdings]);

  const query = useQuery({
    queryKey: ["quotes", symbols.yahoo, symbols.mf, symbols.ulip],
    queryFn: async () => {
      const result = await Promise.race([
        fetchMarketQuotes({ data: symbols }),
        new Promise<null>((resolve) => {
          window.setTimeout(() => resolve(null), 12000);
        }),
      ]);
      if (!result) throw new Error("price timeout");
      return result;
    },
    enabled: hasHydrated,
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
  });

  const mfQuery = useQuery({
    queryKey: ["mf-nav", symbols.mf],
    queryFn: async () => {
      if (symbols.mf.length === 0) return {};
      return fetchMfQuotes({ data: { mf: symbols.mf } });
    },
    enabled: hasHydrated && symbols.mf.length > 0,
    staleTime: 5 * 60_000,
    refetchInterval: 10 * 60_000,
  });

  useEffect(() => {
    if (!query.data) return;
    setPrices(query.data);
    syncHistoryFromTotals();
  }, [query.data, setPrices]);

  useEffect(() => {
    if (!mfQuery.data || Object.keys(mfQuery.data).length === 0) return;
    const prev = usePortfolio.getState().lastPrices ?? FALLBACK_MARKET;
    setPrices({
      ...prev,
      asOf: Date.now(),
      quotes: { ...prev.quotes, ...mfQuery.data },
    });
    syncHistoryFromTotals();
  }, [mfQuery.data, setPrices]);

  useEffect(() => {
    if (!query.isError) return;
    if (usePortfolio.getState().lastPrices) return;
    setPrices({ ...FALLBACK_MARKET, asOf: Date.now() });
    syncHistoryFromTotals();
  }, [query.isError, setPrices]);

  return null;
}

export function useRefreshPrices() {
  const holdings = usePortfolio((s) => s.holdings);
  const setPrices = usePortfolio((s) => s.setPrices);
  const symbols = useMemo(() => collectSymbols(holdings), [holdings]);

  return async () => {
    try {
      const [raced, mf] = await Promise.all([
        Promise.race([
          fetchMarketQuotes({ data: symbols }),
          new Promise<null>((resolve) => {
            window.setTimeout(() => resolve(null), 12000);
          }),
        ]),
        symbols.mf.length ? fetchMfQuotes({ data: { mf: symbols.mf } }).catch(() => ({})) : {},
      ]);
      const data = raced ?? { ...FALLBACK_MARKET, asOf: Date.now() };
      setPrices({
        ...data,
        asOf: Date.now(),
        quotes: { ...data.quotes, ...mf },
      });
      syncHistoryFromTotals();
      return data;
    } catch {
      const data = { ...FALLBACK_MARKET, asOf: Date.now() };
      setPrices(data);
      syncHistoryFromTotals();
      return data;
    }
  };
}