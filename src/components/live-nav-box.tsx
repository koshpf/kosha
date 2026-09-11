import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { FALLBACK_MARKET } from "@/lib/fallback-prices";
import { formatInr, parseAmount } from "@/lib/format";
import { fetchOneQuote } from "@/lib/quotes";
import { mfQuoteKey, yahooSymbol } from "@/lib/symbols";
import { usePortfolio } from "@/lib/store";
import type { AssetType, Exchange, GoldPurity, Holding, Quote } from "@/lib/types";
import { ulipQuoteKey } from "@/lib/ulip-index";
import { goldPriceForPurity } from "@/lib/valuation";

function quoteTarget(
  type: AssetType,
  ticker: string,
  exchange: Exchange,
): { kind: "yahoo" | "mf" | "ulip" | "gold"; id: string; storeKey: string } | null {
  if (type === "physical_gold") return { kind: "gold", id: "GOLD", storeKey: "GOLD" };
  const t = ticker.trim();
  if (!t) return null;
  if (type === "indian_mf") {
    if (!/^\d{4,8}$/.test(t)) return null;
    return { kind: "mf", id: t, storeKey: mfQuoteKey(t) };
  }
  if (type === "ulip") {
    const code = t.toUpperCase();
    if (!/^I[A-Z]{1,3}\d+$/.test(code)) return null;
    return { kind: "ulip", id: code, storeKey: ulipQuoteKey(code) };
  }
  if (type === "indian_stock" || type === "us_stock" || type === "etf") {
    if (/\s/.test(t)) return null;
    const stub: Holding = {
      id: "_",
      name: "",
      type,
      ticker: t,
      exchange,
      quantity: 0,
      avgPrice: 0,
      currency: type === "us_stock" ? "USD" : "INR",
      costBasisInr: 0,
      createdAt: 0,
      updatedAt: 0,
    };
    const y = yahooSymbol(stub);
    if (!y) return null;
    return { kind: "yahoo", id: y, storeKey: y };
  }
  return null;
}

export function LiveNavBox({
  type,
  ticker,
  exchange,
  quantity,
  avgPrice,
  purity = 22,
}: {
  type: AssetType;
  ticker: string;
  exchange: Exchange;
  quantity: string;
  avgPrice: string;
  purity?: GoldPurity;
}) {
  const target = useMemo(
    () => quoteTarget(type, ticker, exchange),
    [type, ticker, exchange],
  );
  const lastPrices = usePortfolio((s) => s.lastPrices);
  const setPrices = usePortfolio((s) => s.setPrices);
  const market = lastPrices ?? FALLBACK_MARKET;
  const cached = target && target.kind !== "gold" ? market.quotes[target.storeKey] : undefined;

  const query = useQuery({
    queryKey: ["one-quote", target?.kind, target?.id],
    enabled: Boolean(target && target.kind !== "gold"),
    staleTime: 60_000,
    queryFn: async () => {
      if (!target || target.kind === "gold") return null;
      return fetchOneQuote({ data: { kind: target.kind, id: target.id } });
    },
  });

  const storeKey = target?.storeKey;
  const kind = target?.kind;

  useEffect(() => {
    if (!query.data || !storeKey || kind === "gold") return;
    const prev = usePortfolio.getState().lastPrices ?? FALLBACK_MARKET;
    const existing = prev.quotes[storeKey];
    if (
      existing &&
      existing.price === query.data.price &&
      existing.currency === query.data.currency
    ) {
      return;
    }
    setPrices({
      ...prev,
      asOf: Date.now(),
      quotes: { ...prev.quotes, [storeKey]: query.data },
    });
  }, [query.data, setPrices, storeKey, kind]);

  const isNav = type === "indian_mf" || type === "ulip";
  const label = isNav ? "Current NAV" : type === "physical_gold" ? "Current ₹ / gram" : "Current price";

  if (!target) {
    return (
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <Input value="" placeholder="Select a ticker to fetch" readOnly tabIndex={-1} />
      </div>
    );
  }
  const live: Quote | null =
    target.kind === "gold"
      ? {
          price: goldPriceForPurity(market, purity),
          currency: "INR",
        }
      : (query.data ?? cached ?? null);

  const qty = parseAmount(quantity);
  const avg = parseAmount(avgPrice);
  const fx = live?.currency === "USD" ? market.usdInr : 1;
  const liveValue =
    live && Number.isFinite(qty) && qty > 0 ? qty * live.price * fx : 0;
  const display =
    live == null
      ? query.isFetching
        ? "Fetching…"
        : query.isError
          ? "Unavailable"
          : ""
      : live.currency === "USD"
        ? `$${live.price.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
        : `₹${live.price.toLocaleString("en-IN", { maximumFractionDigits: isNav || type === "physical_gold" ? 4 : 2 })}`;

  return (
    <>
      <div className="flex flex-col gap-2">
        <Label>{label}</Label>
        <Input value={display || "Pick a name to fetch"} readOnly tabIndex={-1} />
      </div>
      {live && Number.isFinite(qty) && qty > 0 ? (
        <div className="sm:col-span-2 rounded-md bg-muted px-3 py-3 text-sm">
          <p className="text-xs text-muted-foreground">At current price</p>
          <p className="mt-1 font-medium tabular-nums">{formatInr(liveValue)}</p>
          {Number.isFinite(avg) && avg > 0 ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Your average {isNav ? "NAV" : "price"}{" "}
              {live.currency === "USD" ? `$${avg}` : `₹${avg}`}
            </p>
          ) : (
            <p className="mt-1 text-xs text-muted-foreground">Enter average to see P/L after save.</p>
          )}
        </div>
      ) : null}
    </>
  );
}
