import { formatBtcNumber, formatGoldGrams, formatInrNumber } from "@/lib/format";
import type { PortfolioTotals } from "@/lib/types";
import type { UnitInsight } from "@/lib/unit-insight";

const W = 1080;
const H = 1350;
const CREAM = "#f3f1ea";
const INK = "#1a1c19";
const SAGE = "#5c635c";
const CARD = "#fffcf6";
const LINE = "#d9d4c6";
const GAIN = "#2f7a48";
const LOSS = "#b4453d";

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number,
) {
  const radius = Math.min(r, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.arcTo(x + w, y, x + w, y + h, radius);
  ctx.arcTo(x + w, y + h, x, y + h, radius);
  ctx.arcTo(x, y + h, x, y, radius);
  ctx.arcTo(x, y, x + w, y, radius);
  ctx.closePath();
}

function tone(pct: number) {
  if (pct > 0.05) return GAIN;
  if (pct < -0.05) return LOSS;
  return SAGE;
}

export async function renderTreasuryCard(opts: {
  totals: PortfolioTotals;
  insight: UnitInsight | null;
  vaultName?: string;
  hideAmounts?: boolean;
}): Promise<Blob> {
  if (typeof document !== "undefined") {
    try {
      await document.fonts.ready;
    } catch {
      /* ignore */
    }
  }

  const canvas = document.createElement("canvas");
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("Could not draw card");

  ctx.fillStyle = CREAM;
  ctx.fillRect(0, 0, W, H);

  ctx.fillStyle = SAGE;
  ctx.font = "600 28px 'IBM Plex Sans', sans-serif";
  ctx.fillText("KOSHA  ·  BETA", 72, 110);

  ctx.fillStyle = INK;
  ctx.font = "italic 500 92px Fraunces, serif";
  ctx.fillText("Treasury", 72, 220);

  ctx.fillStyle = SAGE;
  ctx.font = "400 28px 'IBM Plex Sans', sans-serif";
  ctx.fillText(opts.vaultName ? `${opts.vaultName} · net worth` : "Net worth in three units", 72, 270);

  const hide = Boolean(opts.hideAmounts);
  const rows = [
    { label: "IN RUPEES", value: hide ? "••••" : `₹${formatInrNumber(opts.totals.currentInr)}` },
    { label: "IN GOLD", value: hide ? "••••" : formatGoldGrams(opts.totals.goldGrams) },
    { label: "IN BITCOIN", value: hide ? "••••" : `${formatBtcNumber(opts.totals.btc)} BTC` },
  ];

  rows.forEach((row, i) => {
    const y = 330 + i * 196;
    roundRect(ctx, 72, y, W - 144, 172, 28);
    ctx.fillStyle = CARD;
    ctx.fill();
    ctx.strokeStyle = LINE;
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = SAGE;
    ctx.font = "600 22px 'IBM Plex Sans', sans-serif";
    ctx.fillText(row.label, 108, y + 52);
    ctx.fillStyle = INK;
    ctx.font = "italic 500 56px Fraunces, serif";
    ctx.fillText(row.value, 108, y + 128);
  });

  if (opts.insight) {
    ctx.fillStyle = INK;
    ctx.font = "italic 500 36px Fraunces, serif";
    wrapText(ctx, opts.insight.headline, 72, 980, W - 144, 48);
    if (!hide) {
      ctx.fillStyle = SAGE;
      ctx.font = "400 24px 'IBM Plex Sans', sans-serif";
      ctx.fillText(opts.insight.detail, 72, 1120);
      const chips = [
        { label: "₹", pct: opts.insight.inrPct },
        { label: "Gold", pct: opts.insight.goldPct },
        { label: "BTC", pct: opts.insight.btcPct },
      ];
      chips.forEach((chip, i) => {
        ctx.fillStyle = tone(chip.pct);
        ctx.font = "600 26px 'IBM Plex Sans', sans-serif";
        ctx.fillText(
          `${chip.label} ${chip.pct >= 0 ? "+" : ""}${chip.pct.toFixed(1)}%`,
          72 + i * 300,
          1180,
        );
      });
    }
  }

  ctx.fillStyle = SAGE;
  ctx.font = "400 24px 'IBM Plex Sans', sans-serif";
  ctx.fillText("koshapftracker.vercel.app", 72, 1288);

  return await new Promise((resolve, reject) => {
    canvas.toBlob((blob) => {
      if (blob) resolve(blob);
      else reject(new Error("Could not export card"));
    }, "image/png");
  });
}

function wrapText(
  ctx: CanvasRenderingContext2D,
  text: string,
  x: number,
  y: number,
  maxWidth: number,
  lineHeight: number,
) {
  const words = text.split(" ");
  let line = "";
  let yy = y;
  for (const word of words) {
    const test = line ? `${line} ${word}` : word;
    if (ctx.measureText(test).width > maxWidth && line) {
      ctx.fillText(line, x, yy);
      line = word;
      yy += lineHeight;
    } else {
      line = test;
    }
  }
  if (line) ctx.fillText(line, x, yy);
}
