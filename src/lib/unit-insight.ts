import { formatPct } from "@/lib/format";
import type { HistoryPoint } from "@/lib/types";

export type UnitInsight = {
  days: number;
  inrPct: number;
  goldPct: number;
  btcPct: number;
  verdict: "poorer-gold" | "richer-gold" | "even";
  headline: string;
  detail: string;
};

function changePct(from: number, to: number): number {
  if (!Number.isFinite(from) || !Number.isFinite(to) || Math.abs(from) < 1e-9) return 0;
  return ((to - from) / Math.abs(from)) * 100;
}

function daysBetween(a: string, b: string): number {
  const pa = a.split("-").map(Number);
  const pb = b.split("-").map(Number);
  const da = new Date(pa[0] ?? 0, (pa[1] ?? 1) - 1, pa[2] ?? 1);
  const db = new Date(pb[0] ?? 0, (pb[1] ?? 1) - 1, pb[2] ?? 1);
  return Math.max(1, Math.round((db.getTime() - da.getTime()) / 86_400_000));
}

export function unitInsight(history: HistoryPoint[]): UnitInsight | null {
  if (history.length < 2) return null;
  const first = history[0];
  const last = history[history.length - 1];
  if (!first || !last) return null;
  const inrPct = changePct(first.inr, last.inr);
  const goldPct = changePct(first.goldG, last.goldG);
  const btcPct = changePct(first.btc, last.btc);
  const goldVsInr = goldPct - inrPct;
  const days = daysBetween(first.date, last.date);

  let verdict: UnitInsight["verdict"] = "even";
  let headline = "Gold and rupees moved together.";
  if (goldVsInr < -1.5) {
    verdict = "poorer-gold";
    headline =
      inrPct > 0.8
        ? "Rupees rose. Gold grams fell. You got poorer in gold."
        : "Your treasury buys less gold than before.";
  } else if (goldVsInr > 1.5) {
    verdict = "richer-gold";
    headline =
      inrPct < -0.8
        ? "Rupees slipped. Gold grams rose. You got richer in gold."
        : "Richer in gold than in rupees.";
  }

  return {
    days,
    inrPct,
    goldPct,
    btcPct,
    verdict,
    headline,
    detail: `${days}-day move · ₹ ${formatPct(inrPct)} · gold ${formatPct(goldPct)} · BTC ${formatPct(btcPct)}`,
  };
}

export function indexedHistory(history: HistoryPoint[]) {
  const first = history[0];
  if (!first || history.length === 0) return [];
  const inr0 = first.inr || 1;
  const gold0 = first.goldG || 1;
  const btc0 = first.btc || 1;
  return history.map((row) => ({
    date: row.date,
    inr: (row.inr / inr0) * 100,
    gold: (row.goldG / gold0) * 100,
    btc: (row.btc / btc0) * 100,
  }));
}
