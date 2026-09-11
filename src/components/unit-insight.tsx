import { Hidden, useHideAmounts } from "@/components/hide-amounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatPct } from "@/lib/format";
import { unitInsight } from "@/lib/unit-insight";
import type { HistoryPoint } from "@/lib/types";
import { cn } from "@/lib/utils";

export function UnitInsightCard({ history }: { history: HistoryPoint[] }) {
  const hide = useHideAmounts();
  const insight = unitInsight(history);
  if (!insight) return null;

  const rows = [
    { key: "₹", pct: insight.inrPct },
    { key: "Gold", pct: insight.goldPct },
    { key: "BTC", pct: insight.btcPct },
  ];

  return (
    <Card>
      <CardHeader>
        <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
          {insight.days}-day purchasing power
        </p>
        <CardTitle className="font-display text-xl font-medium tracking-tight text-pretty">
          {insight.headline}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2">
          {rows.map((row) => (
            <div key={row.key} className="rounded-md bg-muted px-3 py-3">
              <p className="text-xs text-muted-foreground">{row.key}</p>
              <p
                className={cn(
                  "mt-1 text-sm font-medium tabular-nums",
                  row.pct > 0.05 && "text-gain",
                  row.pct < -0.05 && "text-loss",
                )}
              >
                <Hidden>{formatPct(row.pct)}</Hidden>
              </p>
            </div>
          ))}
        </div>
        {hide ? null : (
          <p className="mt-3 text-xs text-subtle">
            Same treasury. Three measuring sticks. If rupees rise and gold grams fall, you got
            poorer in gold.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
