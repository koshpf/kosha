import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { NativeSelect } from "@/components/ui/native-select";
import { formatBtcNumber, formatGoldGrams, formatInr, formatUsd, parseAmount } from "@/lib/format";
import type { MarketQuotes } from "@/lib/types";

type CompareUnit = "USD" | "INR" | "GOLD" | "BTC";

const UNITS: { id: CompareUnit; label: string }[] = [
  { id: "USD", label: "US dollar" },
  { id: "INR", label: "Indian rupee" },
  { id: "GOLD", label: "Gold (grams)" },
  { id: "BTC", label: "Bitcoin" },
];

function toInr(amount: number, unit: CompareUnit, market: MarketQuotes): number {
  if (unit === "INR") return amount;
  if (unit === "USD") return amount * market.usdInr;
  if (unit === "GOLD") return amount * market.goldInrPerGram24k;
  return amount * market.btcInr;
}

export function AssetCompare({ market }: { market: MarketQuotes }) {
  const [raw, setRaw] = useState("100");
  const [unit, setUnit] = useState<CompareUnit>("USD");
  const amount = parseAmount(raw);
  const inr = useMemo(
    () => (Number.isFinite(amount) && amount > 0 ? toInr(amount, unit, market) : 0),
    [amount, unit, market],
  );
  const gold = market.goldInrPerGram24k > 0 ? inr / market.goldInrPerGram24k : 0;
  const btc = market.btcInr > 0 ? inr / market.btcInr : 0;
  const usd = market.usdInr > 0 ? inr / market.usdInr : 0;

  const rows = [
    {
      key: "inr",
      name: "Rupees",
      color: "var(--color-foreground)",
      value: inr > 0 ? formatInr(inr) : "—",
    },
    {
      key: "gold",
      name: "Gold",
      color: "var(--color-muted-foreground)",
      value: inr > 0 ? formatGoldGrams(gold) : "—",
    },
    {
      key: "btc",
      name: "Bitcoin",
      color: "var(--color-gain)",
      value: inr > 0 ? `${formatBtcNumber(btc)} BTC` : "—",
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compare three assets</CardTitle>
        <p className="text-sm text-muted-foreground">
          Type an amount. See the same money in rupees, gold grams, and bitcoin.
        </p>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_12rem]">
          <Input
            value={raw}
            inputMode="decimal"
            onChange={(e) => setRaw(e.target.value)}
            placeholder="100"
            aria-label="Amount"
          />
          <NativeSelect
            value={unit}
            onChange={(e) => setUnit(e.target.value as CompareUnit)}
            aria-label="Unit"
          >
            {UNITS.map((item) => (
              <option key={item.id} value={item.id}>
                {item.label}
              </option>
            ))}
          </NativeSelect>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {rows.map((row) => (
            <div key={row.key} className="flex flex-col items-center rounded-md bg-muted px-2 py-4 text-center">
              <span className="size-2.5 rounded-full" style={{ background: row.color }} />
              <p className="mt-3 font-display text-lg font-medium tracking-tight tabular-nums md:text-xl">
                {row.value}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">{row.name}</p>
            </div>
          ))}
        </div>
        <p className="text-xs text-subtle">
          {unit === "USD" && Number.isFinite(amount) && amount > 0
            ? `${formatUsd(amount)} · 24K gold and live BTC in ₹`
            : "Live India 24K gold and bitcoin prices."}
        </p>
      </CardContent>
    </Card>
  );
}
