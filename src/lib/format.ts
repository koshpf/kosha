import { format } from "date-fns";

const inrFull = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const inrPrecise = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 2,
});

const inrNumber = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 0,
});

const inrNumberPrecise = new Intl.NumberFormat("en-IN", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const usdFull = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 2,
});

const qtyFmt = new Intl.NumberFormat("en-IN", {
  maximumFractionDigits: 4,
});

export function formatInr(value: number, precise = false): string {
  if (!Number.isFinite(value)) return "₹0";
  const rounded = precise ? value : Math.round(value);
  return (precise ? inrPrecise : inrFull).format(rounded);
}

export function formatInrNumber(value: number, precise = false): string {
  if (!Number.isFinite(value)) return "0";
  return (precise ? inrNumberPrecise : inrNumber).format(precise ? value : Math.round(value));
}

export function formatUsd(value: number): string {
  if (!Number.isFinite(value)) return "$0.00";
  return usdFull.format(value);
}

export function formatSignedInr(value: number): string {
  const abs = formatInr(Math.abs(value));
  if (Math.abs(value) < 0.5) return abs;
  return value > 0 ? `+${abs}` : `-${abs}`;
}

export function formatPct(value: number): string {
  if (!Number.isFinite(value)) return "0.00%";
  const abs = Math.abs(value).toFixed(2);
  if (Math.abs(value) < 0.005) return "0.00%";
  return value > 0 ? `+${abs}%` : `-${abs}%`;
}

export function formatQty(value: number): string {
  if (!Number.isFinite(value)) return "0";
  return qtyFmt.format(value);
}

export function formatGoldGrams(value: number): string {
  if (!Number.isFinite(value)) return "0 g";
  const digits = Math.abs(value) >= 100 ? 1 : 2;
  return `${new Intl.NumberFormat("en-IN", {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(value)} g`;
}

export function formatBtc(value: number): string {
  if (!Number.isFinite(value)) return "0 BTC";
  const abs = Math.abs(value);
  const digits = abs >= 1 ? 4 : abs >= 0.01 ? 6 : 8;
  return `${value.toFixed(digits)} BTC`;
}

export function formatBtcNumber(value: number): string {
  if (!Number.isFinite(value)) return "0";
  const abs = Math.abs(value);
  const digits = abs >= 1 ? 4 : abs >= 0.01 ? 6 : 8;
  return value.toFixed(digits);
}

export function formatDate(ts: number | Date | string): string {
  const date = typeof ts === "number" || ts instanceof Date ? new Date(ts) : parseIsoDate(ts);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd/MM/yyyy");
}

export function formatDateTime(ts: number): string {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "dd/MM/yyyy HH:mm");
}

export function formatTime(ts: number): string {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return "—";
  return format(date, "HH:mm");
}

export function relativeTime(ts: number): string {
  const delta = Date.now() - ts;
  if (!Number.isFinite(delta) || ts <= 0) return "Never";
  const mins = Math.floor(delta / 60_000);
  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days === 1) return "Yesterday";
  if (days < 14) return `${days}d ago`;
  return formatDate(ts);
}

export function todayKey(date = new Date()): string {
  return format(date, "yyyy-MM-dd");
}

function parseIsoDate(value: string): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [y, m, d] = value.split("-").map(Number);
    return new Date(y, (m ?? 1) - 1, d ?? 1);
  }
  return new Date(value);
}

export function parseAmount(raw: string): number {
  const cleaned = raw.replace(/,/g, "").replace(/₹/g, "").replace(/\$/g, "").trim();
  if (!cleaned) return 0;
  const n = Number(cleaned);
  return Number.isFinite(n) ? n : NaN;
}

export function pnlTone(value: number): "gain" | "loss" | "flat" {
  if (value > 0.5) return "gain";
  if (value < -0.5) return "loss";
  return "flat";
}
