import { FALLBACK_FX_RATES } from "@/lib/fx";
import type { MarketQuotes } from "@/lib/types";

/** Realistic Sept 2026 stand-ins used when a live feed is down. */
export const FALLBACK_MARKET: MarketQuotes = {
  asOf: Date.now(),
  usdInr: FALLBACK_FX_RATES.USD,
  fxRates: { ...FALLBACK_FX_RATES },
  goldInrPerGram24k: 15240,
  goldUsdPerGram: 160.2,
  btcInr: 7_360_000,
  btcUsd: 77_000,
  quotes: {
    "RELIANCE.NS": { price: 1274, prevClose: 1279, currency: "INR", name: "Reliance Industries" },
    "INFY.NS": { price: 1588.6, prevClose: 1602.0, currency: "INR", name: "Infosys" },
    "HDFCBANK.NS": { price: 1664.0, prevClose: 1651.2, currency: "INR", name: "HDFC Bank" },
    "TCS.NS": { price: 3920.0, prevClose: 3894.5, currency: "INR", name: "Tata Consultancy" },
    "NIFTYBEES.NS": { price: 268.45, prevClose: 266.1, currency: "INR", name: "Nippon Nifty 50 BeES" },
    "GOLDBEES.NS": { price: 82.3, prevClose: 81.7, currency: "INR", name: "Nippon Gold BeES" },
    AAPL: { price: 226.4, prevClose: 224.1, currency: "USD", name: "Apple" },
    MSFT: { price: 431.2, prevClose: 428.6, currency: "USD", name: "Microsoft" },
    GOOGL: { price: 168.9, prevClose: 170.2, currency: "USD", name: "Alphabet" },
    "MF:122639": { price: 91.22, prevClose: 90.84, currency: "INR", name: "Parag Parikh Flexi Cap Direct Growth" },
    "MF:120716": { price: 168.4, prevClose: 167.9, currency: "INR", name: "UTI Nifty 50 Index Direct Growth" },
    "MF:152889": { price: 10.08, prevClose: 10.14, currency: "INR", name: "HDFC NIFTY LargeMidcap 250 Index Direct Growth" },
  },
  live: { fx: false, gold: false, btc: false },
  usedDemo: true,
};
