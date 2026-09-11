import { memo, useMemo, useState } from "react";
import {
  Area,
  AreaChart,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useHideAmounts } from "@/components/hide-amounts";
import { formatBtcNumber, formatDate, formatGoldGrams, formatInr } from "@/lib/format";
import type { HistoryPoint, HistoryUnit } from "@/lib/types";
import { indexedHistory } from "@/lib/unit-insight";
import { cn } from "@/lib/utils";

const UNITS: { id: HistoryUnit | "all"; label: string }[] = [
  { id: "inr", label: "₹" },
  { id: "gold", label: "Gold" },
  { id: "btc", label: "BTC" },
  { id: "all", label: "Compare" },
];

function formatUnit(unit: HistoryUnit, value: number): string {
  if (unit === "gold") return formatGoldGrams(value);
  if (unit === "btc") return formatBtcNumber(value);
  return formatInr(value);
}

export const HistoryChart = memo(function HistoryChart({ history }: { history: HistoryPoint[] }) {
  const [unit, setUnit] = useState<HistoryUnit | "all">("all");
  const hideAmounts = useHideAmounts();
  const data = useMemo(
    () =>
      history.map((row) => ({
        date: row.date,
        value: unit === "gold" ? row.goldG : unit === "btc" ? row.btc : row.inr,
      })),
    [history, unit],
  );
  const indexed = useMemo(() => indexedHistory(history), [history]);

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>{unit === "all" ? "Richer in gold?" : "Net worth"}</CardTitle>
        <div className="flex rounded-md bg-muted p-1">
          {UNITS.map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setUnit(item.id)}
              className={cn(
                "h-8 rounded-sm px-2.5 text-xs font-medium transition-colors duration-150",
                unit === item.id
                  ? "bg-card text-foreground shadow-[var(--shadow-border)]"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-56">
          {history.length < 2 ? (
            <p className="flex h-full items-center text-sm text-muted-foreground">
              History appears after the first price refresh.
            </p>
          ) : unit === "all" ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={indexed} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatDate(String(v)).slice(0, 5)}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tickFormatter={(v) => `${Math.round(Number(v))}`}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={36}
                  domain={["auto", "auto"]}
                />
                <Tooltip
                  isAnimationActive={false}
                  labelFormatter={(label) => formatDate(String(label))}
                  formatter={(value, name) => [
                    hideAmounts ? "••••" : `${Number(value ?? 0).toFixed(1)}`,
                    name === "inr" ? "₹" : name === "gold" ? "Gold" : "BTC",
                  ]}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-foreground)",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="inr"
                  stroke="var(--color-foreground)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="gold"
                  stroke="var(--color-muted-foreground)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
                <Line
                  type="monotone"
                  dataKey="btc"
                  stroke="var(--color-gain)"
                  strokeWidth={1.5}
                  dot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="nw" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="var(--color-primary)" stopOpacity={0.28} />
                    <stop offset="100%" stopColor="var(--color-primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="date"
                  tickFormatter={(v) => formatDate(String(v)).slice(0, 5)}
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  minTickGap={24}
                />
                <YAxis
                  tickFormatter={(v) =>
                    hideAmounts
                      ? ""
                      : unit === "inr"
                        ? `₹${Math.round(Number(v) / 100000)}L`
                        : unit === "gold"
                          ? `${Math.round(Number(v))}g`
                          : Number(v).toFixed(3)
                  }
                  tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                  width={hideAmounts ? 8 : 48}
                />
                <Tooltip
                  isAnimationActive={false}
                  labelFormatter={(label) => formatDate(String(label))}
                  formatter={(value) => (hideAmounts ? "••••" : formatUnit(unit, Number(value ?? 0)))}
                  contentStyle={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                    borderRadius: 8,
                    color: "var(--color-foreground)",
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--color-primary)"
                  fill="url(#nw)"
                  strokeWidth={1.5}
                  isAnimationActive={false}
                  dot={false}
                  activeDot={{ r: 3 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>
        {unit === "all" && history.length >= 2 ? (
          <p className="mt-2 text-xs text-subtle">Start = 100. ₹, gold grams, and BTC on one scale.</p>
        ) : null}
      </CardContent>
    </Card>
  );
});
