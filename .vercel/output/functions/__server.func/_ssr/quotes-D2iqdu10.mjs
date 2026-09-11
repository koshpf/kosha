import { n as TSS_SERVER_FUNCTION, t as createServerFn } from "./ssr.mjs";
import { i as mfQuoteKey, t as FALLBACK_MARKET } from "./symbols-De4dsrfp.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/quotes-D2iqdu10.js
var createServerRpc = (serverFnMeta, splitImportFn) => {
	const url = "/_serverFn/" + serverFnMeta.id;
	return Object.assign(splitImportFn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var UA = "Mozilla/5.0 (compatible; KoshaNetWorth/1.0; +https://grok.com) AppleWebKit/537.36 Chrome/128.0.0.0";
async function fetchJson(url, timeoutMs = 6500) {
	const res = await fetch(url, {
		headers: {
			Accept: "application/json",
			"User-Agent": UA
		},
		signal: AbortSignal.timeout(timeoutMs)
	});
	if (!res.ok) throw new Error(`HTTP ${res.status} for ${url}`);
	return await res.json();
}
async function firstOk(jobs) {
	for (const job of jobs) try {
		return await job();
	} catch {}
	return null;
}
async function fetchFx() {
	return firstOk([
		async () => {
			const n = (await fetchJson("https://open.er-api.com/v6/latest/USD")).rates?.INR;
			if (!n || n < 50 || n > 200) throw new Error("bad fx");
			return n;
		},
		async () => {
			const n = (await fetchJson("https://api.frankfurter.app/latest?from=USD&to=INR")).rates?.INR;
			if (!n) throw new Error("bad fx");
			return n;
		},
		async () => {
			const n = (await fetchJson("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/usd.json")).usd?.inr;
			if (!n) throw new Error("bad fx");
			return n;
		}
	]);
}
async function fetchBtc() {
	return firstOk([async () => {
		const data = await fetchJson("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr,usd");
		const inr = data.bitcoin?.inr;
		const usd = data.bitcoin?.usd;
		if (!inr || !usd) throw new Error("bad btc");
		return {
			inr,
			usd
		};
	}, async () => {
		const data = await fetchJson("https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=inr%2Cusd");
		const inr = data.bitcoin?.inr;
		const usd = data.bitcoin?.usd;
		if (!inr || !usd) throw new Error("bad btc");
		return {
			inr,
			usd
		};
	}]);
}
async function fetchGoldUsdPerOz() {
	return firstOk([async () => {
		const data = await fetchJson("https://api.gold-api.com/price/XAU");
		if (!data.price || data.price < 500) throw new Error("bad gold");
		return data.price;
	}, async () => {
		const n = (await fetchJson("https://api.coingecko.com/api/v3/simple/price?ids=pax-gold&vs_currencies=usd"))["pax-gold"]?.usd;
		if (!n) throw new Error("bad paxg");
		return n;
	}]);
}
async function fetchYahoo(symbol) {
	const encoded = encodeURIComponent(symbol);
	const urls = [`https://query1.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=5d`, `https://query2.finance.yahoo.com/v8/finance/chart/${encoded}?interval=1d&range=5d`];
	for (const url of urls) try {
		const meta = (await fetchJson(url, 3e3)).chart?.result?.[0]?.meta;
		const price = meta?.regularMarketPrice;
		if (!price) continue;
		const currency = meta.currency === "USD" ? "USD" : "INR";
		return {
			price,
			prevClose: meta.previousClose ?? meta.chartPreviousClose,
			currency,
			name: meta.shortName
		};
	} catch {}
	return null;
}
async function fetchMf(code) {
	try {
		const data = await fetchJson(`https://api.mfapi.in/mf/${encodeURIComponent(code)}`, 3e3);
		const nav = Number(data.data?.[0]?.nav);
		const prev = Number(data.data?.[1]?.nav);
		if (!Number.isFinite(nav) || nav <= 0) return null;
		return {
			price: nav,
			prevClose: Number.isFinite(prev) ? prev : void 0,
			currency: "INR",
			name: data.meta?.scheme_name
		};
	} catch {
		return null;
	}
}
async function mapPool(items, limit, worker) {
	const out = new Array(items.length);
	let cursor = 0;
	async function run() {
		while (cursor < items.length) {
			const i = cursor;
			cursor += 1;
			out[i] = await worker(items[i]);
		}
	}
	await Promise.all(Array.from({ length: Math.min(limit, items.length) }, run));
	return out;
}
var fetchMarketQuotes_createServerFn_handler = createServerRpc({
	id: "9d517c9f904e61b744a3f138aaf2b00d752a017c8d627f33386606b4cd7f7947",
	name: "fetchMarketQuotes",
	filename: "src/lib/quotes.ts"
}, (opts) => fetchMarketQuotes.__executeServer(opts));
var fetchMarketQuotes = createServerFn({ method: "POST" }).validator((data) => ({
	yahoo: Array.isArray(data.yahoo) ? data.yahoo.slice(0, 24).map(String) : [],
	mf: Array.isArray(data.mf) ? data.mf.slice(0, 20).map(String) : []
})).handler(fetchMarketQuotes_createServerFn_handler, async ({ data }) => {
	const [fx, btc, goldOz, yahooQuotes, mfQuotes] = await Promise.all([
		fetchFx(),
		fetchBtc(),
		fetchGoldUsdPerOz(),
		mapPool(data.yahoo, 6, async (symbol) => ({
			symbol,
			quote: await fetchYahoo(symbol)
		})),
		mapPool(data.mf, 4, async (code) => ({
			code,
			quote: await fetchMf(code)
		}))
	]);
	const usdInr = fx ?? FALLBACK_MARKET.usdInr;
	let goldUsdPerGram = FALLBACK_MARKET.goldUsdPerGram;
	let goldInrPerGram24k = FALLBACK_MARKET.goldInrPerGram24k;
	const goldLive = goldOz != null;
	if (goldOz) {
		goldUsdPerGram = goldOz / 31.1034768;
		goldInrPerGram24k = goldUsdPerGram * usdInr;
	}
	const quotes = { ...FALLBACK_MARKET.quotes };
	for (const row of yahooQuotes) if (row.quote) quotes[row.symbol] = row.quote;
	for (const row of mfQuotes) if (row.quote) quotes[mfQuoteKey(row.code)] = row.quote;
	const usedDemo = !fx || !btc || !goldLive;
	return {
		asOf: Date.now(),
		usdInr,
		goldInrPerGram24k,
		goldUsdPerGram,
		btcInr: btc?.inr ?? FALLBACK_MARKET.btcInr,
		btcUsd: btc?.usd ?? FALLBACK_MARKET.btcUsd,
		quotes,
		live: {
			fx: fx != null,
			gold: goldLive,
			btc: btc != null
		},
		usedDemo
	};
});
var searchMutualFunds_createServerFn_handler = createServerRpc({
	id: "7d1edf2a6c56c64fb0d012a74a988e16eba249b93eaa17cac596f3d91f9969c1",
	name: "searchMutualFunds",
	filename: "src/lib/quotes.ts"
}, (opts) => searchMutualFunds.__executeServer(opts));
var searchMutualFunds = createServerFn({ method: "POST" }).validator((data) => ({ query: String(data.query ?? "").trim().slice(0, 80) })).handler(searchMutualFunds_createServerFn_handler, async ({ data }) => {
	if (data.query.length < 2) return [];
	try {
		return (await fetchJson(`https://api.mfapi.in/mf/search?q=${encodeURIComponent(data.query)}`, 5e3)).filter((row) => row.schemeCode && row.schemeName).slice(0, 8).map((row) => ({
			schemeCode: row.schemeCode,
			schemeName: row.schemeName
		}));
	} catch {
		return [];
	}
});
function prettyName(value) {
	const trimmed = value.trim();
	if (trimmed.length > 3 && trimmed === trimmed.toUpperCase() && /[A-Z]/.test(trimmed)) return trimmed.toLowerCase().replace(/\b([a-z])/g, (ch) => ch.toUpperCase());
	return trimmed;
}
function mapYahooExchange(quote, symbol) {
	if (/\.NS$/i.test(symbol) || quote.exchange === "NSI" || /NSE/i.test(quote.exchDisp ?? "")) return "NSE";
	if (/\.BO$/i.test(symbol) || quote.exchange === "BSE" || /BSE|Bombay/i.test(quote.exchDisp ?? "")) return "BSE";
	if ([
		"NMS",
		"NYQ",
		"NGM",
		"NCM",
		"NAS",
		"NYSE",
		"BTS",
		"PCX",
		"ASE",
		"CQS"
	].includes(quote.exchange ?? "") || /NASDAQ|NYSE|NYSEArca|BATS/i.test(quote.exchDisp ?? "")) return "US";
}
function yahooToHit(quote) {
	const symbol = String(quote.symbol ?? "").trim();
	if (!symbol || symbol.includes("=") || symbol.includes("^")) return null;
	const kind = (quote.quoteType ?? "").toUpperCase();
	if (kind === "OPTION" || kind === "FUTURE" || kind === "INDEX" || kind === "CURRENCY") return null;
	const ticker = symbol.replace(/\.(NS|BO)$/i, "");
	const name = prettyName(quote.longname || quote.shortname || ticker);
	const exchange = mapYahooExchange(quote, symbol);
	return {
		ticker,
		name,
		exchange,
		detail: [quote.exchDisp || exchange, quote.typeDisp].filter(Boolean).join(" · ")
	};
}
function matchesType(hit, type, quoteType) {
	const kind = (quoteType ?? "").toUpperCase();
	if (type === "indian_stock") return hit.exchange === "NSE" || hit.exchange === "BSE";
	if (type === "us_stock") return hit.exchange === "US" && kind !== "ETF";
	if (type === "etf") {
		if (kind === "ETF") return true;
		if (hit.exchange === "NSE" || hit.exchange === "BSE") return true;
		return /ETF|BEES|INAV/i.test(`${hit.ticker} ${hit.name} ${hit.detail ?? ""}`);
	}
	return true;
}
async function lookupExactSymbols(query, type) {
	const q = query.trim().toUpperCase();
	if (!/^[A-Z0-9.&-]{1,15}$/.test(q)) return [];
	const symbols = [];
	if (type === "us_stock" || type === "etf") symbols.push({
		symbol: q,
		exchange: "US"
	});
	if (type === "indian_stock" || type === "etf" || type === "") symbols.push({
		symbol: `${q}.NS`,
		exchange: "NSE"
	}, {
		symbol: `${q}.BO`,
		exchange: "BSE"
	});
	return (await Promise.all(symbols.map(async ({ symbol, exchange }) => {
		const quote = await fetchYahoo(symbol);
		if (!quote?.price) return null;
		return {
			ticker: q,
			name: prettyName(quote.name || q),
			exchange,
			detail: exchange
		};
	}))).filter((row) => row != null);
}
async function fetchYahooSearch(query) {
	const encoded = encodeURIComponent(query);
	const urls = [`https://query1.finance.yahoo.com/v1/finance/search?q=${encoded}&quotesCount=12&newsCount=0`, `https://query2.finance.yahoo.com/v1/finance/search?q=${encoded}&quotesCount=12&newsCount=0`];
	for (const url of urls) try {
		const data = await fetchJson(url, 3200);
		if (data.quotes?.length) return data.quotes;
	} catch {}
	return [];
}
var searchTickers_createServerFn_handler = createServerRpc({
	id: "b23621a74cd47c1d46b54a639d79ce4b21dd9703d8b8fdba856fa54c7f3ffcfd",
	name: "searchTickers",
	filename: "src/lib/quotes.ts"
}, (opts) => searchTickers.__executeServer(opts));
var searchTickers = createServerFn({ method: "POST" }).validator((data) => ({
	query: String(data.query ?? "").trim().slice(0, 40),
	type: String(data.type ?? "")
})).handler(searchTickers_createServerFn_handler, async ({ data }) => {
	if (data.query.length < 1) return [];
	const mapped = (await fetchYahooSearch(data.query)).map((quote) => {
		const hit = yahooToHit(quote);
		return hit ? {
			hit,
			quoteType: quote.quoteType
		} : null;
	}).filter((row) => row != null);
	const typed = mapped.filter((row) => matchesType(row.hit, data.type, row.quoteType)).map((row) => row.hit);
	const preferred = typed.length ? typed : mapped.map((row) => row.hit);
	const exact = preferred.length ? [] : await lookupExactSymbols(data.query, data.type);
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const hit of [...exact, ...preferred]) {
		const key = `${hit.ticker}|${hit.exchange ?? ""}`;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push(hit);
		if (out.length >= 8) break;
	}
	return out;
});
//#endregion
export { fetchMarketQuotes_createServerFn_handler, searchMutualFunds_createServerFn_handler, searchTickers_createServerFn_handler };
