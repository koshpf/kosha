//#region node_modules/.nitro/vite/services/ssr/assets/symbols-De4dsrfp.js
/** Realistic Sept 2026 stand-ins used when a live feed is down. */
var FALLBACK_MARKET = {
	asOf: Date.now(),
	usdInr: 87.25,
	goldInrPerGram24k: 10240,
	goldUsdPerGram: 117.35,
	btcInr: 9842500,
	btcUsd: 112800,
	quotes: {
		"RELIANCE.NS": {
			price: 1412.4,
			prevClose: 1398.1,
			currency: "INR",
			name: "Reliance Industries"
		},
		"INFY.NS": {
			price: 1588.6,
			prevClose: 1602,
			currency: "INR",
			name: "Infosys"
		},
		"HDFCBANK.NS": {
			price: 1664,
			prevClose: 1651.2,
			currency: "INR",
			name: "HDFC Bank"
		},
		"TCS.NS": {
			price: 3920,
			prevClose: 3894.5,
			currency: "INR",
			name: "Tata Consultancy"
		},
		"NIFTYBEES.NS": {
			price: 268.45,
			prevClose: 266.1,
			currency: "INR",
			name: "Nippon Nifty 50 BeES"
		},
		"GOLDBEES.NS": {
			price: 82.3,
			prevClose: 81.7,
			currency: "INR",
			name: "Nippon Gold BeES"
		},
		AAPL: {
			price: 226.4,
			prevClose: 224.1,
			currency: "USD",
			name: "Apple"
		},
		MSFT: {
			price: 431.2,
			prevClose: 428.6,
			currency: "USD",
			name: "Microsoft"
		},
		GOOGL: {
			price: 168.9,
			prevClose: 170.2,
			currency: "USD",
			name: "Alphabet"
		},
		"MF:122639": {
			price: 91.22,
			prevClose: 90.84,
			currency: "INR",
			name: "Parag Parikh Flexi Cap Direct Growth"
		},
		"MF:120716": {
			price: 168.4,
			prevClose: 167.9,
			currency: "INR",
			name: "UTI Nifty 50 Index Direct Growth"
		}
	},
	live: {
		fx: false,
		gold: false,
		btc: false
	},
	usedDemo: true
};
function yahooSymbol(holding) {
	const raw = holding.ticker?.trim().toUpperCase();
	if (!raw) return null;
	if (holding.type === "indian_stock" || holding.type === "etf" && holding.exchange !== "US") {
		if (raw.includes(".")) return raw;
		return holding.exchange === "BSE" ? `${raw}.BO` : `${raw}.NS`;
	}
	if (holding.type === "us_stock" || holding.type === "etf" && holding.exchange === "US") return raw;
	return null;
}
function mfQuoteKey(code) {
	return `MF:${code.trim()}`;
}
function mfCode(holding) {
	if (holding.type !== "indian_mf") return null;
	const raw = holding.ticker?.trim();
	if (raw && /^\d{4,8}$/.test(raw)) return raw;
	return null;
}
function collectSymbols(holdings) {
	const yahoo = /* @__PURE__ */ new Set();
	const mf = /* @__PURE__ */ new Set();
	for (const holding of holdings) {
		const y = yahooSymbol(holding);
		if (y) yahoo.add(y);
		const code = mfCode(holding);
		if (code) mf.add(code);
	}
	return {
		yahoo: [...yahoo].slice(0, 40),
		mf: [...mf].slice(0, 40)
	};
}
//#endregion
export { yahooSymbol as a, mfQuoteKey as i, collectSymbols as n, mfCode as r, FALLBACK_MARKET as t };
