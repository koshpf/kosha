import { memo, useMemo, useState } from "react";
import { Area, AreaChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Hidden, useHideAmounts } from "@/components/hide-amounts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBtc, formatDate, formatGoldGrams, formatInr } from "@/lib/format";
import type { HistoryPoint, HistoryUnit } from "@/lib/types";
import { cn } from "@/lib/utils";

type View = HistoryUnit | "all";

const UNITS: { id: View; label: string }[] = [
  { id: "all", label: "Compare" },
  { id: "inr", label: "₹" },
  { id: "gold", label: "Gold" },
  { id: "btc", label: "BTC" },
];

const ASSETS = [
  { key: "inr" as const, name: "Rupees", color: "var(--color-foreground)", format: formatInr },
  { key: "gold" as const, name: "Gold", color: "var(--color-muted-foreground)", format: formatGoldGrams },
  { key: "btc" as const, name: "Bitcoin", color: "var(--color-gain)", format: formatBtc },
];

function formatUnit(unit: HistoryUnit, value: number): string {
  if (unit === "gold") return formatGoldGrams(value);
  if (unit === "btc") return formatBtc(value);
  return formatInr(value);
}

function formatAxisInr(value: number): string {
  const v = Number(value);
  if (!Number.isFinite(v)) return "";
  const abs = Math.abs(v);
  if (abs >= 1_00_00_000) return `₹${(v / 1_00_00_000).toFixed(1)}Cr`;
  if (abs >= 1_00_000) return `₹${(v / 1_00_000).toFixed(1)}L`;
  if (abs >= 1_000) return `₹${(v / 1_000).toFixed(0)}k`;
  return `₹${Math.round(v)}`;
}

function pointValue(row: HistoryPoint, key: "inr" | "gold" | "btc") {
  if (key === "gold") return row.goldG;
  if (key === "btc") return row.btc;
  return row.inr;
}

export const HistoryChart = memo(function HistoryChart({ history }: { history: HistoryPoint[] }) {
  const [unit, setUnit] = useState<View>("all");
  const hideAmounts = useHideAmounts();
  const data = useMemo(
    () =>
      history.map((row) => ({
        date: row.date,
        value: unit === "gold" ? row.goldG : unit === "btc" ? row.btc : row.inr,
      })),
    [history, unit],
  );
  const latest = history[history.length - 1];

  return (
    <Card className="h-full">
      <CardHeader className="flex-row items-center justify-between gap-3">
        <CardTitle>Net worth</CardTitle>
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
        {history.length < 1 ? (
          <p className="flex h-56 items-center text-sm text-muted-foreground">
            History starts the day you add a holding.
          </p>
        ) : unit === "all" ? (
          <div className="flex flex-col gap-4">
            <p className="text-xs text-muted-foreground">
              Same total net worth, in three assets.
            </p>
            {ASSETS.map((asset) => {
              const series = history.map((row) => ({
                date: row.date,
                value: pointValue(row, asset.key),
              }));
              const now = latest ? pointValue(latest, asset.key) : 0;
              return (
                <div key={asset.key}>
                  <div className="mb-1 flex items-end justify-between gap-3">
                    <span className="flex items-center gap-2 text-sm">
                      <span className="size-2.5 rounded-full" style={{ background: asset.color }} />
                      {asset.name}
                    </span>
                    <span className="font-display text-lg font-medium tabular-nums tracking-tight">
                      <Hidden>{asset.format(now)}</Hidden>
                    </span>
                  </div>
                  <div className="h-14">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={series} margin={{ top: 4, right: 0, left: 0, bottom: 0 }}>
                        <Area
                          type="monotone"
                          dataKey="value"
                          stroke={asset.color}
                          fill={asset.color}
                          fillOpacity={0.14}
                          strokeWidth={1.5}
                          isAnimationActive={false}
                          dot={false}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="h-56">
            {data.length < 2 ? (
              <p className="flex h-full items-center text-sm text-muted-foreground">
                History starts the day you add a holding.
              </p>
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
                          ? formatAxisInr(Number(v))
                          : unit === "gold"
                            ? `${Number(v).toFixed(0)}g`
                            : Number(v).toFixed(3)
                    }
                    tick={{ fill: "var(--color-muted-foreground)", fontSize: 11 }}
                    axisLine={false}
                    tickLine={false}
                    width={hideAmounts ? 8 : 52}
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
        )}
      </CardContent>
    </Card>
  );
});
