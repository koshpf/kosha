import { memo } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHideAmounts } from "@/components/hide-amounts";
import { typeShortLabel } from "@/lib/asset-types";
import { formatInr } from "@/lib/format";
import type { HoldingView } from "@/lib/types";
import { allocationByType } from "@/lib/valuation";

const SLICE: Record<string, string> = {
  indian_stock: "var(--color-primary)",
  us_stock: "color-mix(in oklab, var(--color-primary) 70%, var(--color-foreground))",
  indian_mf: "color-mix(in oklab, var(--color-primary) 45%, var(--color-muted-foreground))",
  etf: "color-mix(in oklab, var(--color-foreground) 55%, var(--color-muted))",
  physical_gold: "color-mix(in oklab, var(--color-muted-foreground) 80%, var(--color-primary))",
  ulip: "color-mix(in oklab, var(--color-foreground) 35%, var(--color-card))",
  usd_cash: "color-mix(in oklab, var(--color-gain) 55%, var(--color-muted))",
  bank: "color-mix(in oklab, var(--color-foreground) 25%, var(--color-muted))",
  rd: "color-mix(in oklab, var(--color-muted-foreground) 70%, var(--color-card))",
  fd: "color-mix(in oklab, var(--color-muted-foreground) 50%, var(--color-card))",
  other: "color-mix(in oklab, var(--color-subtle) 80%, var(--color-foreground))",
};

export const AllocationChart = memo(function AllocationChart({ views }: { views: HoldingView[] }) {
  const hideAmounts = useHideAmounts();
  const rows = allocationByType(views);
  const total = rows.reduce((sum, row) => sum + row.value, 0);
  const data = rows.map((row) => ({
    name: typeShortLabel(row.type),
    value: row.value,
    type: row.type,
  }));

  if (data.length === 0) {
    return (
      <Card className="h-full">
        <CardHeader>
          <CardTitle>Allocation</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Add a holding to see allocation.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle>Allocation</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]">
        <div className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="name"
                innerRadius={62}
                outerRadius={88}
                paddingAngle={2}
                stroke="var(--color-card)"
                isAnimationActive={false}
              >
                {data.map((entry) => (
                  <Cell key={entry.type} fill={SLICE[entry.type] ?? "var(--color-primary)"} />
                ))}
              </Pie>
              <Tooltip
                isAnimationActive={false}
                formatter={(value) =>
                  hideAmounts ? "••••" : formatInr(Number(value ?? 0))
                }
                contentStyle={{
                  background: "var(--color-card)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 8,
                  color: "var(--color-foreground)",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <ul className="flex flex-col justify-center gap-2 text-sm">
          {data.map((row) => (
            <li key={row.type} className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-muted-foreground">
                <span
                  className="size-2 rounded-full"
                  style={{ background: SLICE[row.type] }}
                />
                {row.name}
              </span>
              <span className="tabular-nums">
                {total > 0 ? `${((row.value / total) * 100).toFixed(1)}%` : "0%"}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
});
