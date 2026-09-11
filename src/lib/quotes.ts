import { createServerFn } from "@tanstack/react-start";
import { FALLBACK_MARKET } from "@/lib/fallback-prices";
import { FX_CURRENCIES, FALLBACK_FX_RATES } from "@/lib/fx";
import { rankMutualFunds, MF_SEEDS, type MfRow } from "@/lib/mf-index";
import { mfQuoteKey } from "@/lib/symbols";
import { ulipByCode, ulipQuoteKey } from "@/lib/ulip-index";
import type { TickerHit } from "@/lib/ticker-index";
import type { Exchange, MarketQuotes, Quote } from "@/lib/types";

const UA =
  "Mozilla/5.0 (compatible; KoshaNetWorth/1.0; +https://grok.com) AppleWebKit/537.36 Chrome/128.0.0.0";

type FetchInput = {
  yahoo: string[];
  mf: string[];
  ulip?: string[];
};

async function fetchJson<T>(url: string, timeoutMs = 4000): Promise<T> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": UA },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return (await res.json()) as T;
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url: string, timeoutMs = 6000): Promise<string> {
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      headers: { Accept: "text/html,application/xhtml+xml", "User-Agent": UA },
      signal: ctrl.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
    return await res.text();
  } finally {
    clearTimeout(timer);
  }
}

async function firstOk<T>(jobs: Array<() => Promise<T>>): Promise<T | null> {
  try {
    return await Promise.any(jobs.map((job) => job()));
  } catch {
    return null;
  }
}

async function fetchFxTable(): Promise<Record<string, number> | null> {
  return firstOk([
    async () => {
      const data = await fetchJson<{ rates?: Record<string, number> }>(
        "https://open.er-api.com/v6/latest/USD",
        2500,
      );
      const usdInr = data.rates?.INR;
      if (!usdInr || usdInr < 50 || usdInr > 200) throw new Error("bad fx");
      const table: Record<string, number> = { USD: usdInr };
      for (const { code } of FX_CURRENCIES) {
        if (code === "USD") continue;
        const perUsd = data.rates?.[code];
        if (perUsd && perUsd > 0) table[code] = usdInr / perUsd;
      }
      return table;
    },
  ]);
}

async function fetchBtc(): Promise<{ inr: number; usd: number } | null> {
  return firstOk([
    async () => {
      const data = await fetchJson<{ data?: { amount?: string } }>(
        "https://api.coinbase.com/v2/prices/BTC-USD/spot",
        2500,
      );
      const usd = Number(data.data?.amount);
      if (!Number.isFinite(usd) || usd < 20_000 || usd > 500_000) throw new Error("bad coinbase");
      return { usd, inr: 0 };
    },
    async () => {
      const quote = await fetchYahoo("BTC-USD");
      const usd = quote?.price;
      if (!usd || usd < 20_000 || usd > 500_000) throw new Error("bad yahoo btc");
      return { usd, inr: 0 };
    },
  ]);
}

function mcxGoldExpiryDates(): string[] {
  const now = new Date();
  const out: string[] = [];
  for (let i = 0; i < 8; i++) {
    const d = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + i, 5));
    const month = d.getUTCMonth() + 1;
    if (month % 2 !== 0) continue;
    out.push(`${d.getUTCFullYear()}-${String(month).padStart(2, "0")}-05`);
  }
  return out.slice(0, 3);
}

async function fetchIndiaGoldPerGram24k(): Promise<number | null> {
  const jobs = mcxGoldExpiryDates().map((expiry) => async () => {
    const data = await fetchJson<{ data?: { lastPrice?: string; prevClose?: string } }>(
      `https://priceapi.moneycontrol.com/pricefeed/mcx/commodityfutures/GOLD?expiry=${expiry}`,
      2500,
    );
    const n = Number(data.data?.lastPrice || data.data?.prevClose);
    if (!Number.isFinite(n) || n < 80_000 || n > 400_000) throw new Error("bad mcx gold");
    return n / 10;
  });
  return firstOk(jobs);
}

async function fetchGoldUsdPerOz(): Promise<number | null> {
  return firstOk([
    async () => {
      const data = await fetchJson<{ price?: number }>("https://api.gold-api.com/price/XAU", 2500);
      if (!data.price || data.price < 500 || data.price > 20000) throw new Error("bad gold");
      return data.price;
    },
  ]);
}

async function fetchYahoo(symbol: string): Promise<Quote | null> {
  const encoded = encodeURIComponent(symbol);
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=1d`,
    `https://query2.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=1d`,
  ];
  for (const url of urls) {
    try {
      const data = await fetchJson<{
        chart?: {
          result?: Array<{
            meta?: {
              regularMarketPrice?: number;
              previousClose?: number;
              chartPreviousClose?: number;
              currency?: string;
              shortName?: string;
            };
          }>;
        };
      }>(url, 2500);
      const meta = data.chart?.result?.[0]?.meta;
      const price = meta?.regularMarketPrice;
      if (!price) continue;
      return {
        price,
        prevClose: meta.previousClose ?? meta.chartPreviousClose,
        currency: meta.currency === "USD" ? "USD" : "INR",
        name: meta.shortName,
      };
    } catch {
      /* next url */
    }
  }
  return null;
}

async function fetchYahooBatch(symbols: string[]): Promise<Record<string, Quote>> {
  const out: Record<string, Quote> = {};
  if (!symbols.length) return out;
  const encoded = symbols.map(encodeURIComponent).join(",");
  const urls = [
    `https://query1.finance.yahoo.com/v8/finance/spark?symbols=${encoded}&range=1d&interval=1d`,
    `https://query2.finance.yahoo.com/v8/finance/spark?symbols=${encoded}&range=1d&interval=1d`,
  ];
  for (const url of urls) {
    try {
      const data = await fetchJson<
        Record<
          string,
          {
            symbol?: string;
            fulldayPrice?: number;
            close?: number[];
            chartPreviousClose?: number;
            previousClose?: number;
          }
        >
      >(url, 4000);
      for (const [symbol, row] of Object.entries(data)) {
        const price = row.fulldayPrice ?? row.close?.[row.close.length - 1];
        if (!price) continue;
        out[symbol] = {
          price,
          prevClose: row.previousClose ?? row.chartPreviousClose,
          currency: /\.(NS|BO)$/i.test(symbol) || /-INR$/i.test(symbol) ? "INR" : "USD",
        };
      }
      if (Object.keys(out).length) return out;
    } catch {
      /* next */
    }
  }
  return out;
}

async function fetchMf(code: string): Promise<Quote | null> {
  return firstOk([
    async () => {
      const data = await fetchJson<{
        meta?: { scheme_name?: string };
        data?: Array<{ nav?: string }>;
      }>(`https://api.mfapi.in/mf/${encodeURIComponent(code)}`, 5000);
      const nav = Number(data.data?.[0]?.nav);
      const prev = Number(data.data?.[1]?.nav);
      if (!Number.isFinite(nav) || nav <= 0) throw new Error("bad nav");
      return {
        price: nav,
        prevClose: Number.isFinite(prev) ? prev : undefined,
        currency: "INR" as const,
        name: data.meta?.scheme_name,
      };
    },
    async () => {
      const data = await fetchJson<{
        meta?: { scheme_name?: string };
        data?: Array<{ nav?: string }>;
      }>(`https://api.mfapi.in/mf/${encodeURIComponent(code)}/latest`, 5000);
      const nav = Number(data.data?.[0]?.nav);
      if (!Number.isFinite(nav) || nav <= 0) throw new Error("bad nav");
      return {
        price: nav,
        prevClose: undefined,
        currency: "INR" as const,
        name: data.meta?.scheme_name,
      };
    },
  ]);
}

async function fetchUlip(code: string): Promise<Quote | null> {
  const fund = ulipByCode(code);
  if (!fund) return null;
  try {
    const html = await fetchText(
      `https://www.moneycontrol.com/insurance/ulip/${fund.path}`,
      8000,
    );
    const match =
      html.match(/class="FL PR8 [^"]*"><strong>([0-9]+(?:\.[0-9]+)?)<\/strong>/) ??
      html.match(/<(?:div|span) class="[^"]*(?:gR_30|rD_30)"><strong>([0-9]+(?:\.[0-9]+)?)<\/strong>/) ??
      html.match(/NAV as on[\s\S]{0,80}?([0-9]{1,4}\.[0-9]{2,4})/i);
    const nav = Number(match?.[1]);
    if (!Number.isFinite(nav) || nav <= 0) return null;
    const chg = html.match(/<strong>([-0-9.]+)<\/strong>\s*\(([-0-9.]+)%\)/);
    const delta = Number(chg?.[1]);
    return {
      price: nav,
      prevClose: Number.isFinite(delta) ? nav - delta : undefined,
      currency: "INR",
      name: fund.name,
    };
  } catch {
    return null;
  }
}

async function mapPool<T, R>(
  items: T[],
  limit: number,
  worker: (item: T) => Promise<R>,
): Promise<R[]> {
  const out: R[] = new Array(items.length);
  let cursor = 0;
  async function run() {
    while (cursor < items.length) {
      const i = cursor;
      cursor += 1;
      out[i] = await worker(items[i] as T);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
  return out;
}

export const fetchMarketQuotes = createServerFn({ method: "POST" })
  .validator((data: FetchInput) => ({
    yahoo: Array.isArray(data.yahoo) ? data.yahoo.slice(0, 20).map(String) : [],
    mf: Array.isArray(data.mf) ? data.mf.slice(0, 12).map(String) : [],
    ulip: Array.isArray(data.ulip) ? data.ulip.slice(0, 12).map(String) : [],
  }))
  .handler(async ({ data }): Promise<MarketQuotes> => {
    const yahooSymbols = [...new Set([...data.yahoo, "BTC-USD", "BTC-INR"])];
    const [fxTable, indiaGold, goldOz, yahooMap, mfQuotes, coinbaseBtc] = await Promise.all([
      fetchFxTable(),
      fetchIndiaGoldPerGram24k(),
      fetchGoldUsdPerOz(),
      fetchYahooBatch(yahooSymbols),
      mapPool(data.mf, 6, async (code) => ({
        code,
        quote: await fetchMf(code),
      })),
      fetchBtc(),
    ]);
    const ulipQuotes = data.ulip.length
      ? await Promise.race([
          mapPool(data.ulip, 3, async (code) => ({
            code,
            quote: await fetchUlip(code),
          })),
          new Promise<Array<{ code: string; quote: Quote | null }>>((resolve) => {
            setTimeout(() => resolve([]), 5000);
          }),
        ])
      : [];

    const btcUsdLive = yahooMap["BTC-USD"]?.price ?? coinbaseBtc?.usd ?? null;
    const btcInrLive = yahooMap["BTC-INR"]?.price ?? null;
    const usdInr =
      fxTable?.USD ??
      (btcUsdLive && btcInrLive && btcUsdLive > 0 ? btcInrLive / btcUsdLive : FALLBACK_MARKET.usdInr);
    const fxRates = { ...FALLBACK_FX_RATES, ...(fxTable ?? {}), USD: usdInr };

    let goldUsdPerGram = FALLBACK_MARKET.goldUsdPerGram;
    let goldInrPerGram24k = FALLBACK_MARKET.goldInrPerGram24k;
    const goldLive = indiaGold != null || goldOz != null;
    if (indiaGold) {
      goldInrPerGram24k = indiaGold;
      goldUsdPerGram = usdInr > 0 ? indiaGold / usdInr : goldUsdPerGram;
    } else if (goldOz) {
      goldUsdPerGram = goldOz / 31.1034768;
      goldInrPerGram24k = goldUsdPerGram * usdInr * 1.14;
    }

    const btcUsd = btcUsdLive ?? FALLBACK_MARKET.btcUsd;
    const btcInr =
      btcInrLive && btcInrLive > 100_000
        ? btcInrLive
        : btcUsdLive
          ? btcUsdLive * usdInr
          : FALLBACK_MARKET.btcInr;
    const btcLive = btcUsdLive != null || btcInrLive != null;

    const quotes: Record<string, Quote> = { ...FALLBACK_MARKET.quotes };
    for (const [symbol, quote] of Object.entries(yahooMap)) {
      if (symbol === "BTC-USD" || symbol === "BTC-INR") continue;
      quotes[symbol] = quote;
    }
    for (const row of mfQuotes) {
      if (row.quote) quotes[mfQuoteKey(row.code)] = row.quote;
    }
    for (const row of ulipQuotes) {
      if (row.quote) quotes[ulipQuoteKey(row.code)] = row.quote;
    }

    return {
      asOf: Date.now(),
      usdInr,
      fxRates,
      goldInrPerGram24k,
      goldUsdPerGram,
      btcInr,
      btcUsd,
      quotes,
      live: { fx: fxTable != null, gold: goldLive, btc: btcLive },
      usedDemo: !btcLive,
    };
  });

export const fetchOneQuote = createServerFn({ method: "POST" })
  .validator((data: { kind: "yahoo" | "mf" | "ulip"; id: string }) => ({
    kind: data.kind === "mf" ? "mf" : data.kind === "ulip" ? "ulip" : "yahoo",
    id: String(data.id ?? "").trim(),
  }))
  .handler(async ({ data }): Promise<Quote | null> => {
    if (!data.id) return null;
    if (data.kind === "mf") return fetchMf(data.id);
    if (data.kind === "ulip") return fetchUlip(data.id);
    const map = await fetchYahooBatch([data.id]);
    return map[data.id] ?? null;
  });

export const fetchMfQuotes = createServerFn({ method: "POST" })
  .validator((data: { mf: string[] }) => ({
    mf: Array.isArray(data.mf) ? data.mf.slice(0, 20).map(String) : [],
  }))
  .handler(async ({ data }): Promise<Record<string, Quote>> => {
    const rows = await mapPool(data.mf, 6, async (code) => ({
      code,
      quote: await fetchMf(code),
    }));
    const quotes: Record<string, Quote> = {};
    for (const row of rows) {
      if (row.quote) quotes[mfQuoteKey(row.code)] = row.quote;
    }
    return quotes;
  });


let mfCatalog: MfRow[] | null = null;
let mfCatalogLoad: Promise<MfRow[]> | null = null;

async function loadMfCatalog(): Promise<MfRow[]> {
  if (mfCatalog) return mfCatalog;
  if (!mfCatalogLoad) {
    mfCatalogLoad = fetchJson<Array<{ schemeCode?: number; schemeName?: string }>>(
      "https://api.mfapi.in/mf",
      12000,
    )
      .then((rows) => {
        mfCatalog = rows
          .filter((row) => row.schemeCode && row.schemeName)
          .map((row) => ({
            code: String(row.schemeCode),
            name: String(row.schemeName),
          }));
        return mfCatalog;
      })
      .catch(() => {
        mfCatalogLoad = null;
        return [];
      });
  }
  return mfCatalogLoad;
}

export const searchMutualFunds = createServerFn({ method: "POST" })
  .validator((data: { query: string }) => ({
    query: String(data.query ?? "").trim().slice(0, 80),
  }))
  .handler(async ({ data }): Promise<Array<{ schemeCode: number; schemeName: string }>> => {
    if (data.query.length < 2) return [];
    const catalog = await loadMfCatalog();
    const ranked = rankMutualFunds(catalog.length ? catalog : MF_SEEDS, data.query, 10);
    return ranked.map((row) => ({
      schemeCode: Number(row.code),
      schemeName: row.name,
    }));
  });

export const warmupMutualFunds = createServerFn({ method: "POST" }).handler(async () => {
  const rows = await loadMfCatalog();
  return { count: rows.length };
});

type YahooSearchQuote = {
  symbol?: string;
  shortname?: string;
  longname?: string;
  quoteType?: string;
  typeDisp?: string;
  exchange?: string;
  exchDisp?: string;
};

function prettyName(value: string): string {
  const trimmed = value.trim();
  if (trimmed.length > 3 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) {
    return trimmed.toLowerCase().replace(/\b([a-z])/g, (ch) => ch.toUpperCase());
  }
  return trimmed;
}

function mapYahooExchange(quote: YahooSearchQuote, symbol: string): Exchange | undefined {
  if (/\.NS$/i.test(symbol) || quote.exchange === "NSI" || /NSE/i.test(quote.exchDisp ?? "")) return "NSE";
  if (/\.BO$/i.test(symbol) || quote.exchange === "BSE" || /BSE|Bombay/i.test(quote.exchDisp ?? "")) return "BSE";
  if (
    ["NMS", "NYQ", "NGM", "NCM", "NAS", "NYSE", "BTS", "PCX", "ASE", "CQS"].includes(quote.exchange ?? "") ||
    /NASDAQ|NYSE|NYSEArca|BATS/i.test(quote.exchDisp ?? "")
  ) {
    return "US";
  }
  return undefined;
}

function yahooToHit(quote: YahooSearchQuote): TickerHit | null {
  const symbol = String(quote.symbol ?? "").trim();
  if (!symbol || symbol.includes("=") || symbol.includes("^")) return null;
  const kind = (quote.quoteType ?? "").toUpperCase();
  if (kind === "OPTION" || kind === "FUTURE" || kind === "INDEX" || kind === "CURRENCY") return null;
  const ticker = symbol.replace(/\.(NS|BO)$/i, "");
  const name = prettyName(quote.longname || quote.shortname || ticker);
  const exchange = mapYahooExchange(quote, symbol);
  const detail = [quote.exchDisp || exchange, quote.typeDisp].filter(Boolean).join(" · ");
  return { ticker, name, exchange, detail };
}

function matchesType(hit: TickerHit, type: string, quoteType: string | undefined): boolean {
  const kind = (quoteType ?? "").toUpperCase();
  if (type === "indian_stock") {
    return hit.exchange === "NSE" || hit.exchange === "BSE";
  }
  if (type === "us_stock") {
    return hit.exchange === "US" && kind !== "ETF";
  }
  if (type === "etf") {
    if (kind === "ETF") return true;
    if (hit.exchange === "NSE" || hit.exchange === "BSE") return true;
    return /ETF|BEES|INAV/i.test(`${hit.ticker} ${hit.name} ${hit.detail ?? ""}`);
  }
  return true;
}

async function lookupExactSymbols(query: string, type: string): Promise<TickerHit[]> {
  const q = query.trim().toUpperCase();
  if (!/^[A-Z0-9.&-]{5,15}$/.test(q)) return [];
  const symbols: Array<{ symbol: string; exchange: Exchange }> = [];
  if (type === "us_stock" || type === "etf") symbols.push({ symbol: q, exchange: "US" });
  if (type === "indian_stock" || type === "etf" || type === "") {
    symbols.push({ symbol: `${q}.NS`, exchange: "NSE" }, { symbol: `${q}.BO`, exchange: "BSE" });
  }
  const rows = await Promise.all(
    symbols.map(async ({ symbol, exchange }): Promise<TickerHit | null> => {
      const quote = await fetchYahoo(symbol);
      if (!quote?.price) return null;
      return {
        ticker: q,
        name: prettyName(quote.name || q),
        exchange,
        detail: exchange,
      };
    }),
  );
  return rows.filter((row): row is TickerHit => row != null);
}

async function fetchYahooSearch(query: string): Promise<YahooSearchQuote[]> {
  const encoded = encodeURIComponent(query);
  const urls = [
    `https://query1.finance.yahoo.com/v1/finance/search?q=${encoded}&quotesCount=8&newsCount=0`,
    `https://query2.finance.yahoo.com/v1/finance/search?q=${encoded}&quotesCount=8&newsCount=0`,
  ];
  for (const url of urls) {
    try {
      const data = await fetchJson<{ quotes?: YahooSearchQuote[] }>(url, 2500);
      if (data.quotes?.length) return data.quotes;
    } catch {
      /* next */
    }
  }
  return [];
}

export const searchTickers = createServerFn({ method: "POST" })
  .validator((data: { query: string; type?: string }) => ({
    query: String(data.query ?? "").trim().slice(0, 40),
    type: String(data.type ?? ""),
  }))
  .handler(async ({ data }): Promise<TickerHit[]> => {
    if (data.query.length < 1) return [];
    const quotes = await fetchYahooSearch(data.query);
    const mapped = quotes
      .map((quote) => {
        const hit = yahooToHit(quote);
        return hit ? { hit, quoteType: quote.quoteType } : null;
      })
      .filter((row): row is { hit: TickerHit; quoteType: string | undefined } => row != null);
    const typed = mapped.filter((row) => matchesType(row.hit, data.type, row.quoteType)).map((row) => row.hit);
    const preferred = typed.length ? typed : mapped.map((row) => row.hit);
    const exact =
      preferred.length || data.query.length < 5
        ? []
        : await lookupExactSymbols(data.query, data.type);
    const seen = new Set<string>();
    const out: TickerHit[] = [];
    for (const hit of [...exact, ...preferred]) {
      const key = `${hit.ticker}|${hit.exchange ?? ""}`;
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(hit);
      if (out.length >= 8) break;
    }
    return out;
  });
