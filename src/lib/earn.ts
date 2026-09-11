import type { AssetType } from "@/lib/types";

export type EarnConfig = {
  upiId: string;
  upiName: string;
  growwUrl: string;
  zerodhaUrl: string;
  coinUrl: string;
};

/** Baked-in publisher links. Fill these before Publish so every visitor uses YOUR codes. */
export const OWNER_EARN: EarnConfig = {
  upiId: "koshapf@axl",
  upiName: "Rahul Kumar",
  growwUrl: "",
  zerodhaUrl: "",
  coinUrl: "",
};

export const EMPTY_EARN: EarnConfig = { ...OWNER_EARN };

export function isEarnConfig(value: unknown): value is EarnConfig {
  if (!value || typeof value !== "object") return false;
  const row = value as EarnConfig;
  return typeof row.upiId === "string";
}

export function mergeEarn(value: unknown): EarnConfig {
  const row = isEarnConfig(value) ? value : EMPTY_EARN;
  return {
    upiId: row.upiId?.trim() || OWNER_EARN.upiId,
    upiName: row.upiName?.trim() || OWNER_EARN.upiName || "Rahul Kumar",
    growwUrl: row.growwUrl?.trim() || OWNER_EARN.growwUrl,
    zerodhaUrl: row.zerodhaUrl?.trim() || OWNER_EARN.zerodhaUrl,
    coinUrl: row.coinUrl?.trim() || OWNER_EARN.coinUrl,
  };
}

export function upiPayHref(upiId: string, amount?: number, name = "Rahul Kumar"): string | null {
  const pa = upiId.trim();
  if (!pa || !pa.includes("@")) return null;
  const params = new URLSearchParams({ pa, pn: name.trim() || "Kosha", cu: "INR" });
  if (amount && amount > 0) params.set("am", String(amount));
  params.set("tn", "Support Kosha");
  return `upi://pay?${params.toString()}`;
}

export type Partner = {
  id: "groww" | "zerodha" | "coin";
  label: string;
  url: string;
  blurb: string;
};

export function partnersFrom(earn: EarnConfig): Partner[] {
  const rows: Partner[] = [];
  if (earn.growwUrl) {
    rows.push({
      id: "groww",
      label: "Groww",
      url: earn.growwUrl,
      blurb: "Stocks, MFs, and ETFs",
    });
  }
  if (earn.zerodhaUrl) {
    rows.push({
      id: "zerodha",
      label: "Zerodha",
      url: earn.zerodhaUrl,
      blurb: "Indian stocks and ETFs",
    });
  }
  if (earn.coinUrl) {
    rows.push({
      id: "coin",
      label: "Coin",
      url: earn.coinUrl,
      blurb: "Bitcoin and crypto",
    });
  }
  return rows;
}

export function partnerForType(type: AssetType, earn: EarnConfig): Partner | null {
  const partners = partnersFrom(earn);
  if (type === "indian_stock" || type === "indian_mf" || type === "etf") {
    return partners.find((row) => row.id === "groww") ?? partners.find((row) => row.id === "zerodha") ?? null;
  }
  if (type === "us_stock") {
    return partners.find((row) => row.id === "groww") ?? null;
  }
  if (type === "other") {
    return partners.find((row) => row.id === "coin") ?? null;
  }
  return null;
}
