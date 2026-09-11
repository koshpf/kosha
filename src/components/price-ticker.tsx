import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatDateTime, formatInr, formatUsd, relativeTime } from "@/lib/format";
import type { MarketQuotes } from "@/lib/types";
import { goldPriceForPurity } from "@/lib/valuation";

export function PriceTicker({
  market,
  refreshing,
  onRefresh,
}: {
  market: MarketQuotes;
  refreshing?: boolean;
  onRefresh?: () => void;
}) {
  const gold22 = goldPriceForPurity(market, 22);
  return (
    <div className="flex flex-col gap-3 rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)] md:flex-row md:items-center md:justify-between">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm tabular-nums">
        <span>
          Gold 24K {formatInr(market.goldInrPerGram24k, true)}/g
          <span className="text-muted-foreground"> · India</span>
        </span>
        <span className="text-subtle">22K {formatInr(gold22, true)}/g</span>
        <span>
          BTC {formatInr(market.btcInr)}
          <span className="text-muted-foreground"> · {formatUsd(market.btcUsd)}</span>
        </span>
        <span>USD {formatInr(market.usdInr, true)}</span>
      </div>
      <div className="flex items-center gap-3">
        <p className="text-xs text-muted-foreground">
          {market.usedDemo ? "Indicative prices · " : "Live · "}
          <span title={formatDateTime(market.asOf)}>{relativeTime(market.asOf)}</span>
        </p>
        {onRefresh ? (
          <Button
            variant="outline"
            size="sm"
            onClick={onRefresh}
            disabled={refreshing}
            aria-label="Refresh prices"
          >
            <RefreshCw className={refreshing ? "animate-spin" : undefined} />
            Refresh
          </Button>
        ) : null}
      </div>
    </div>
  );
}
