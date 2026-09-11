import type { MarketQuotes } from "@/lib/types";

function holdPrice(
  previous: number,
  next: number,
  previousLive: boolean,
  nextLive: boolean,
  maxJump: number,
): number {
  if (!(next > 0)) return previous > 0 ? previous : next;
  if (!(previous > 0)) return next;
  if (previousLive && !nextLive) return previous;
  if (previousLive && Math.abs(next - previous) / previous > maxJump) return previous;
  return next;
}

/** Keep gold/BTC from flipping between MCX, dollar gold, and fallback on each refresh. */
export function mergeMarketQuotes(previous: MarketQuotes | null, next: MarketQuotes): MarketQuotes {
  if (!previous) return next;
  const goldInr = holdPrice(
    previous.goldInrPerGram24k,
    next.goldInrPerGram24k,
    previous.live.gold,
    next.live.gold,
    0.03,
  );
  const btcInr = holdPrice(previous.btcInr, next.btcInr, previous.live.btc, next.live.btc, 0.12);
  const btcUsd = holdPrice(previous.btcUsd, next.btcUsd, previous.live.btc, next.live.btc, 0.12);
  const goldKept = goldInr === previous.goldInrPerGram24k && goldInr !== next.goldInrPerGram24k;
  const usdInr = next.usdInr > 0 ? next.usdInr : previous.usdInr;
  return {
    ...next,
    usdInr,
    fxRates: { ...previous.fxRates, ...next.fxRates, USD: usdInr },
    goldInrPerGram24k: goldInr,
    goldUsdPerGram: usdInr > 0 ? goldInr / usdInr : next.goldUsdPerGram,
    btcInr,
    btcUsd,
    live: {
      fx: next.live.fx || previous.live.fx,
      gold: next.live.gold || (previous.live.gold && goldKept) || previous.live.gold,
      btc: next.live.btc || previous.live.btc,
    },
    usedDemo: next.usedDemo && previous.usedDemo,
    quotes: { ...previous.quotes, ...next.quotes },
  };
}
