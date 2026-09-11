import { Bitcoin, IndianRupee, Scale } from "lucide-react";
import { Hidden } from "@/components/hide-amounts";
import { Card } from "@/components/ui/card";
import { PnlText } from "@/components/pnl";
import {
  formatBtcNumber,
  formatGoldGrams,
  formatInrNumber,
  formatUsd,
} from "@/lib/format";
import type { MarketQuotes, PortfolioTotals } from "@/lib/types";

export function NetWorthCards({
  totals,
  market,
  showUsd,
}: {
  totals: PortfolioTotals;
  market: MarketQuotes;
  showUsd: boolean;
}) {
  const cards = [
    {
      key: "inr",
      label: "Indian rupees",
      icon: IndianRupee,
      value: `₹${formatInrNumber(totals.currentInr)}`,
      sub: showUsd ? formatUsd(totals.usd) : "Default currency",
      extra: <PnlText amount={totals.dayChangeInr} />,
      extraLabel: "Today",
      maskSub: true,
    },
    {
      key: "gold",
      label: "Same total in gold",
      icon: Scale,
      value: formatGoldGrams(totals.goldGrams),
      sub: `₹${formatInrNumber(market.goldInrPerGram24k, true)} / g · India 24K`,
      extra: (
        <span className="tabular-nums text-muted-foreground">
          {formatUsd(market.goldUsdPerGram)} / g
        </span>
      ),
      extraLabel: "Spot",
      maskSub: false,
    },
    {
      key: "btc",
      label: "Same total in bitcoin",
      icon: Bitcoin,
      value: formatBtcNumber(totals.btc),
      sub: `₹${formatInrNumber(market.btcInr)} / BTC`,
      extra: (
        <span className="tabular-nums text-muted-foreground">{formatUsd(market.btcUsd)}</span>
      ),
      extraLabel: "Spot",
      maskSub: false,
    },
  ];

  return (
    <div className="grid gap-3 md:grid-cols-3">
      {cards.map((card) => (
        <Card key={card.key} className="flex flex-col gap-5 p-5">
          <div className="flex items-center justify-between">
            <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              {card.label}
            </p>
            <card.icon className="size-4 text-subtle" />
          </div>
          <p className="font-display text-3xl leading-none font-medium tracking-tight tabular-nums md:text-4xl">
            <Hidden>{card.value}</Hidden>
          </p>
          <div className="flex items-end justify-between gap-3 text-sm">
            <p className="text-muted-foreground">
              {card.maskSub ? <Hidden>{card.sub}</Hidden> : card.sub}
            </p>
            <div className="text-right">
              <p className="text-xs text-subtle">{card.extraLabel}</p>
              {card.extra}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}