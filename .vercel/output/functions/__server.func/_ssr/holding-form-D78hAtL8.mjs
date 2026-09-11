import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { y as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as FALLBACK_MARKET } from "./symbols-De4dsrfp.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as ASSET_TYPE_MAP, E as ASSET_TYPES, S as usePortfolio, v as parseAmount } from "./router-CUJh-yqh.mjs";
import { a as searchMutualFunds, i as cn, n as Button, o as searchTickers, r as buttonVariants } from "./button-2iqXmBEn.mjs";
import { t as Input } from "./input-BBVS02xX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/holding-form-D78hAtL8.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Label({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
		className: cn("text-sm font-medium text-foreground", className),
		...props
	});
}
function NativeSelect({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("h-11 w-full rounded-md border border-border bg-background px-3 text-sm outline-none transition-[border-color,box-shadow] duration-150 focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30", className),
		...props
	});
}
function Textarea({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
		className: cn("min-h-24 w-full rounded-md border border-border bg-background px-3 py-2 text-sm outline-none transition-[border-color,box-shadow] duration-150 placeholder:text-subtle focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30", className),
		...props
	});
}
var SEEDS = [
	{
		ticker: "RELIANCE",
		name: "Reliance Industries",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "TCS",
		name: "Tata Consultancy Services",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "INFY",
		name: "Infosys",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "HDFCBANK",
		name: "HDFC Bank",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ICICIBANK",
		name: "ICICI Bank",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "SBIN",
		name: "State Bank of India",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "BHARTIARTL",
		name: "Bharti Airtel",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ITC",
		name: "ITC",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "HINDUNILVR",
		name: "Hindustan Unilever",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "LT",
		name: "Larsen & Toubro",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "AXISBANK",
		name: "Axis Bank",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "KOTAKBANK",
		name: "Kotak Mahindra Bank",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "BAJFINANCE",
		name: "Bajaj Finance",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ASIANPAINT",
		name: "Asian Paints",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "MARUTI",
		name: "Maruti Suzuki",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "TITAN",
		name: "Titan Company",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "SUNPHARMA",
		name: "Sun Pharma",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "WIPRO",
		name: "Wipro",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "HCLTECH",
		name: "HCL Technologies",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "TATAMOTORS",
		name: "Tata Motors",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "TATASTEEL",
		name: "Tata Steel",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "NTPC",
		name: "NTPC",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "POWERGRID",
		name: "Power Grid",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ONGC",
		name: "ONGC",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "COALINDIA",
		name: "Coal India",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ADANIENT",
		name: "Adani Enterprises",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ADANIPORTS",
		name: "Adani Ports",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "M&M",
		name: "Mahindra & Mahindra",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "BAJAJFINSV",
		name: "Bajaj Finserv",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "TECHM",
		name: "Tech Mahindra",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "CIPLA",
		name: "Cipla",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "DRREDDY",
		name: "Dr. Reddy's Laboratories",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "NESTLEIND",
		name: "Nestle India",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ULTRACEMCO",
		name: "UltraTech Cement",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "JIOFIN",
		name: "Jio Financial",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "BEL",
		name: "Bharat Electronics",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "ZOMATO",
		name: "Eternal (Zomato)",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "TRENT",
		name: "Trent",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "LICI",
		name: "Life Insurance Corporation",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "IRCTC",
		name: "IRCTC",
		exchange: "NSE",
		kinds: ["indian_stock"]
	},
	{
		ticker: "NIFTYBEES",
		name: "Nippon India Nifty 50 BeES",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "GOLDBEES",
		name: "Nippon India Gold BeES",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "BANKBEES",
		name: "Nippon India Bank BeES",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "ITBEES",
		name: "Nippon India IT BeES",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "JUNIORBEES",
		name: "Nippon India Junior BeES",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "SILVERBEES",
		name: "Nippon India Silver BeES",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "LIQUIDBEES",
		name: "Nippon India Liquid BeES",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "MON100",
		name: "Motilal Oswal Nasdaq 100 ETF",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "SETFNIF50",
		name: "SBI Nifty 50 ETF",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "CPSEETF",
		name: "CPSE ETF",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "ICICINIFTY",
		name: "ICICI Prudential Nifty 50 ETF",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "MOM100",
		name: "Motilal Oswal Midcap 100 ETF",
		exchange: "NSE",
		kinds: ["etf"]
	},
	{
		ticker: "AAPL",
		name: "Apple",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "MSFT",
		name: "Microsoft",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "GOOGL",
		name: "Alphabet",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "AMZN",
		name: "Amazon",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "NVDA",
		name: "NVIDIA",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "META",
		name: "Meta Platforms",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "TSLA",
		name: "Tesla",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "BRK-B",
		name: "Berkshire Hathaway",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "JPM",
		name: "JPMorgan Chase",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "V",
		name: "Visa",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "UNH",
		name: "UnitedHealth",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "NFLX",
		name: "Netflix",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "AMD",
		name: "AMD",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "COST",
		name: "Costco",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "JNJ",
		name: "Johnson & Johnson",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "WMT",
		name: "Walmart",
		exchange: "US",
		kinds: ["us_stock"]
	},
	{
		ticker: "SPY",
		name: "SPDR S&P 500 ETF",
		exchange: "US",
		kinds: ["etf"]
	},
	{
		ticker: "QQQ",
		name: "Invesco QQQ",
		exchange: "US",
		kinds: ["etf"]
	},
	{
		ticker: "VOO",
		name: "Vanguard S&P 500 ETF",
		exchange: "US",
		kinds: ["etf"]
	},
	{
		ticker: "VTI",
		name: "Vanguard Total Stock Market",
		exchange: "US",
		kinds: ["etf"]
	},
	{
		ticker: "GLD",
		name: "SPDR Gold Shares",
		exchange: "US",
		kinds: ["etf"]
	}
];
function searchLocalTickers(query, type) {
	const q = query.trim().toLowerCase();
	if (!q) return [];
	const rows = SEEDS.filter((row) => {
		if (type === "indian_stock") return row.kinds.includes("indian_stock");
		if (type === "us_stock") return row.kinds.includes("us_stock");
		if (type === "etf") return row.kinds.includes("etf");
		return true;
	});
	return (rows.length ? rows : SEEDS).map((row) => {
		const ticker = row.ticker.toLowerCase();
		const name = row.name.toLowerCase();
		let score = 0;
		if (ticker === q) score = 100;
		else if (ticker.startsWith(q)) score = 80;
		else if (ticker.includes(q)) score = 50;
		else if (name.startsWith(q)) score = 40;
		else if (name.includes(q)) score = 20;
		return {
			row,
			score
		};
	}).filter((row) => row.score > 0).sort((a, b) => b.score - a.score || a.row.ticker.localeCompare(b.row.ticker)).slice(0, 8).map(({ row }) => ({
		ticker: row.ticker,
		name: row.name,
		exchange: row.exchange,
		detail: row.exchange
	}));
}
function TickerSearch({ type, value, onChange, onPick, onAutoName, autoFocus }) {
	const [hits, setHits] = (0, import_react.useState)([]);
	const [lookingUp, setLookingUp] = (0, import_react.useState)(false);
	const seq = (0, import_react.useRef)(0);
	const onAutoNameRef = (0, import_react.useRef)(onAutoName);
	onAutoNameRef.current = onAutoName;
	const isMf = type === "indian_mf";
	(0, import_react.useEffect)(() => {
		const query = value.trim();
		if (query.length < 1) {
			setHits([]);
			setLookingUp(false);
			return;
		}
		const local = isMf ? [] : searchLocalTickers(query, type);
		if (local.length) {
			setHits(local);
			const exact = local.find((hit) => hit.ticker.toLowerCase() === query.toLowerCase());
			if (exact) onAutoNameRef.current(exact.name);
		} else setHits([]);
		if (query.length < (isMf ? 2 : 1)) return;
		const id = ++seq.current;
		setLookingUp(true);
		const timer = window.setTimeout(async () => {
			try {
				const remotePromise = isMf ? searchMutualFunds({ data: { query } }).then((rows) => rows.map((row) => ({
					ticker: String(row.schemeCode),
					name: row.schemeName,
					detail: String(row.schemeCode)
				}))) : searchTickers({ data: {
					query,
					type
				} });
				const remote = await Promise.race([remotePromise, new Promise((resolve) => {
					window.setTimeout(() => resolve([]), 3500);
				})]);
				if (seq.current !== id) return;
				const merged = mergeHits(local, remote);
				setHits(merged);
				const exact = merged.find((hit) => hit.ticker.toLowerCase() === query.toLowerCase()) ?? (merged.length === 1 ? merged[0] : void 0);
				if (exact?.name) onAutoNameRef.current(exact.name);
			} catch {
				if (seq.current === id && local.length === 0) setHits([]);
			} finally {
				if (seq.current === id) setLookingUp(false);
			}
		}, 220);
		return () => {
			window.clearTimeout(timer);
			seq.current += 1;
		};
	}, [
		value,
		type,
		isMf
	]);
	function pick(hit) {
		onPick(hit);
		setHits([]);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
			value,
			autoFocus,
			autoComplete: "off",
			spellCheck: false,
			onChange: (e) => {
				onChange(isMf ? e.target.value : e.target.value.toUpperCase());
			},
			onKeyDown: (e) => {
				if (e.key === "Enter" && hits[0]) {
					e.preventDefault();
					pick(hits[0]);
				}
			},
			placeholder: isMf ? "Parag Parikh or 122639" : "RELIANCE or MON100"
		}),
		lookingUp ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-xs text-muted-foreground",
			children: "Looking up ticker…"
		}) : null,
		hits.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
			className: "mt-2 overflow-hidden rounded-md bg-muted",
			children: hits.map((hit) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				type: "button",
				className: "flex min-h-11 w-full touch-manipulation flex-col justify-center px-3 py-2 text-left text-sm hover:bg-border",
				onClick: () => pick(hit),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: isMf ? hit.name : hit.ticker
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-muted-foreground",
					children: isMf ? hit.ticker : [hit.name, hit.detail].filter(Boolean).join(" · ")
				})]
			}) }, `${hit.ticker}-${hit.exchange ?? hit.detail ?? ""}`))
		}) : null
	] });
}
function mergeHits(local, remote) {
	const best = /* @__PURE__ */ new Map();
	for (const hit of local) best.set(`${hit.ticker}|${hit.exchange ?? ""}`, hit);
	for (const hit of remote) {
		const key = `${hit.ticker}|${hit.exchange ?? ""}`;
		const prev = best.get(key);
		if (prev && prev.name.length > hit.name.length) best.set(key, {
			...hit,
			name: prev.name
		});
		else best.set(key, hit);
	}
	const out = [];
	const seen = /* @__PURE__ */ new Set();
	for (const hit of [...remote, ...local]) {
		const key = `${hit.ticker}|${hit.exchange ?? ""}`;
		if (seen.has(key)) continue;
		seen.add(key);
		const row = best.get(key);
		if (row) out.push(row);
		if (out.length >= 8) break;
	}
	return out;
}
function emptyForm(type = "indian_stock") {
	return {
		name: "",
		type,
		ticker: "",
		exchange: type === "us_stock" ? "US" : "NSE",
		quantity: "",
		avgPrice: "",
		costBasisInr: "",
		purity: 22,
		manualValueInr: "",
		notes: ""
	};
}
function fromHolding(holding) {
	return {
		name: holding.name,
		type: holding.type,
		ticker: holding.ticker ?? "",
		exchange: holding.exchange ?? (holding.type === "us_stock" ? "US" : "NSE"),
		quantity: String(holding.quantity || ""),
		avgPrice: String(holding.avgPrice || ""),
		costBasisInr: String(holding.costBasisInr || ""),
		purity: holding.purity ?? 22,
		manualValueInr: holding.manualValueInr != null ? String(holding.manualValueInr) : "",
		notes: holding.notes ?? ""
	};
}
var CASH_LIKE = [
	"tata_aia",
	"bank",
	"rd",
	"fd",
	"other"
];
function isCashLike(type) {
	return CASH_LIKE.includes(type);
}
function needsTicker(type) {
	return type === "indian_stock" || type === "us_stock" || type === "etf" || type === "indian_mf";
}
function TypePicker() {
	const navigate = useNavigate();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative z-10 mx-auto max-w-2xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				method: "get",
				action: "/holdings/new",
				className: "mb-6",
				onSubmit: (e) => {
					const select = e.currentTarget.elements.namedItem("type")?.value;
					if (select) {
						e.preventDefault();
						navigate({
							to: "/holdings/new",
							search: { type: select }
						});
					}
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
					htmlFor: "holding-type",
					children: "Type"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-col gap-2 sm:flex-row",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
						id: "holding-type",
						name: "type",
						required: true,
						defaultValue: "",
						className: "touch-manipulation",
						onChange: (e) => {
							const next = e.target.value;
							if (next) navigate({
								to: "/holdings/new",
								search: { type: next }
							});
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "",
							disabled: true,
							children: "Choose type"
						}), ASSET_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: item.id,
							children: item.label
						}, item.id))]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						className: "touch-manipulation sm:w-auto",
						children: "Continue"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm font-medium",
				children: "Or tap a type"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3",
				children: ASSET_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("a", {
					href: `/holdings/new?type=${encodeURIComponent(item.id)}`,
					className: "flex min-h-14 touch-manipulation cursor-pointer flex-col justify-center rounded-md bg-muted px-3 py-3 text-left text-sm text-foreground no-underline active:bg-border",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "block font-medium",
						children: item.shortLabel
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mt-0.5 block text-xs text-muted-foreground",
						children: item.hint
					})]
				}, item.id))
			})
		]
	});
}
function HoldingForm({ existing, initialType }) {
	const navigate = useNavigate();
	const addHolding = usePortfolio((s) => s.addHolding);
	const updateHolding = usePortfolio((s) => s.updateHolding);
	const usdInr = usePortfolio((s) => s.lastPrices?.usdInr) ?? FALLBACK_MARKET.usdInr;
	const [form, setForm] = (0, import_react.useState)(existing ? fromHolding(existing) : emptyForm(initialType ?? "indian_stock"));
	const [error, setError] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const nameTouched = (0, import_react.useRef)(Boolean(existing?.name));
	const patch = (partial) => setForm((prev) => ({
		...prev,
		...partial
	}));
	const qtyLabel = (0, import_react.useMemo)(() => {
		switch (form.type) {
			case "physical_gold": return "Grams";
			case "usd_cash": return "Amount (USD)";
			case "indian_mf": return "Units";
			case "bank": return "Balance (₹)";
			default: return "Quantity / units";
		}
	}, [form.type]);
	const priceLabel = (0, import_react.useMemo)(() => {
		switch (form.type) {
			case "indian_mf": return "Average NAV";
			case "physical_gold": return "Buy price per gram (₹)";
			case "us_stock": return "Average buy price (USD)";
			case "usd_cash": return "INR spent per USD (optional)";
			default: return "Average buy price (₹)";
		}
	}, [form.type]);
	function submit(e) {
		e.preventDefault();
		setError(null);
		const name = form.name.trim();
		if (!name) {
			setError("Name is required.");
			return;
		}
		if (needsTicker(form.type) && !form.ticker.trim()) {
			setError(form.type === "indian_mf" ? "Enter a scheme code or pick a fund." : "Ticker is required.");
			return;
		}
		const quantity = parseAmount(form.quantity);
		const avgPrice = parseAmount(form.avgPrice || "0");
		const manual = form.manualValueInr.trim() ? parseAmount(form.manualValueInr) : void 0;
		if (!isCashLike(form.type) || form.type === "bank") {
			if (Number.isNaN(quantity) || quantity <= 0) {
				setError("Enter a valid quantity.");
				return;
			}
		}
		if (form.avgPrice && Number.isNaN(avgPrice)) {
			setError("Enter a valid buy price.");
			return;
		}
		if (manual != null && Number.isNaN(manual)) {
			setError("Enter a valid current value.");
			return;
		}
		const currency = form.type === "us_stock" || form.type === "usd_cash" ? "USD" : "INR";
		let qty = quantity;
		let price = avgPrice;
		if (isCashLike(form.type) && form.type !== "bank") {
			const invested = form.costBasisInr.trim() ? parseAmount(form.costBasisInr) : avgPrice || quantity;
			if (Number.isNaN(invested) || invested < 0) {
				setError("Enter a valid invested amount.");
				return;
			}
			qty = 1;
			price = invested;
		}
		let costBasisInr = form.costBasisInr.trim() ? parseAmount(form.costBasisInr) : NaN;
		if (!Number.isFinite(costBasisInr) || costBasisInr < 0) {
			if (form.type === "usd_cash") costBasisInr = qty * (price > 0 ? price : usdInr);
			else if (form.type === "us_stock") costBasisInr = qty * price * usdInr;
			else if (isCashLike(form.type)) costBasisInr = price || quantity;
			else costBasisInr = qty * price;
		}
		const now = Date.now();
		const payload = {
			id: existing?.id ?? `hld_${now.toString(36)}_${Math.random().toString(36).slice(2, 7)}`,
			name,
			type: form.type,
			ticker: form.ticker.trim() || void 0,
			exchange: form.type === "indian_stock" || form.type === "etf" ? form.exchange : form.type === "us_stock" ? "US" : void 0,
			quantity: form.type === "bank" ? manual ?? quantity : qty,
			avgPrice: form.type === "bank" ? 1 : price,
			currency,
			costBasisInr,
			purity: form.type === "physical_gold" ? form.purity : void 0,
			manualValueInr: form.type === "bank" ? manual ?? quantity : isCashLike(form.type) || form.type === "physical_gold" ? manual : void 0,
			notes: form.notes.trim() || void 0,
			createdAt: existing?.createdAt ?? now,
			updatedAt: now
		};
		setSaving(true);
		if (existing) updateHolding(existing.id, payload);
		else addHolding(payload);
		toast.success(existing ? "Holding updated" : "Holding added");
		navigate({ to: "/holdings" });
	}
	const selectedMeta = ASSET_TYPE_MAP[form.type];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
		onSubmit: submit,
		className: "mx-auto flex max-w-2xl flex-col gap-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between gap-3 rounded-md bg-muted px-3 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Type"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: selectedMeta.label
				})] }), existing ? null : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
					href: "/holdings/new",
					className: cn(buttonVariants({
						variant: "outline",
						size: "sm"
					}), "touch-manipulation no-underline"),
					children: "Change"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: [
					needsTicker(form.type) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: form.type === "indian_mf" ? "Scheme name or AMFI code" : "Ticker",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TickerSearch, {
							type: form.type,
							value: form.ticker,
							autoFocus: !existing,
							onChange: (ticker) => patch({ ticker }),
							onPick: (hit) => {
								nameTouched.current = true;
								patch({
									ticker: hit.ticker,
									name: hit.name,
									exchange: hit.exchange ?? form.exchange
								});
							},
							onAutoName: (name) => {
								if (nameTouched.current) return;
								patch({ name });
							}
						})
					}) : null,
					form.type === "indian_stock" || form.type === "etf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Exchange",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: form.exchange,
							onChange: (e) => patch({ exchange: e.target.value }),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "NSE",
									children: "NSE"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "BSE",
									children: "BSE"
								}),
								form.type === "etf" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "US",
									children: "US"
								}) : null
							]
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Name",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: form.name,
							onChange: (e) => {
								nameTouched.current = e.target.value.trim().length > 0;
								patch({ name: e.target.value });
							},
							placeholder: "e.g. Reliance Industries",
							required: true,
							autoFocus: !needsTicker(form.type) && !existing
						})
					}),
					form.type === "physical_gold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Purity",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(NativeSelect, {
							value: String(form.purity),
							onChange: (e) => patch({ purity: Number(e.target.value) }),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "22",
								children: "22K"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "24",
								children: "24K"
							})]
						})
					}) : null,
					!isCashLike(form.type) || form.type === "bank" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: qtyLabel,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "decimal",
							value: form.quantity,
							onChange: (e) => patch({ quantity: e.target.value }),
							placeholder: "0",
							required: true
						})
					}) : null,
					!isCashLike(form.type) && form.type !== "bank" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: priceLabel,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "decimal",
							value: form.avgPrice,
							onChange: (e) => patch({ avgPrice: e.target.value }),
							placeholder: "0"
						})
					}) : null,
					isCashLike(form.type) ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Amount invested (₹)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "decimal",
							value: form.costBasisInr,
							onChange: (e) => patch({ costBasisInr: e.target.value }),
							placeholder: "0"
						})
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Cost basis (₹, optional)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "decimal",
							value: form.costBasisInr,
							onChange: (e) => patch({ costBasisInr: e.target.value }),
							placeholder: "Calculated from quantity × price"
						})
					}),
					isCashLike(form.type) || form.type === "physical_gold" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: form.type === "physical_gold" ? "Manual current value (₹, optional)" : "Current value (₹)",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							inputMode: "decimal",
							value: form.manualValueInr,
							onChange: (e) => patch({ manualValueInr: e.target.value }),
							placeholder: form.type === "bank" ? "Same as balance if blank" : "0"
						})
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Notes",
						className: "sm:col-span-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: form.notes,
							onChange: (e) => patch({ notes: e.target.value }),
							placeholder: "Optional"
						})
					})
				]
			}),
			error ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-loss",
				children: error
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col-reverse gap-2 sm:flex-row sm:justify-end",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "button",
					variant: "outline",
					onClick: () => navigate({ to: "/holdings" }),
					children: "Cancel"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: saving,
					children: existing ? "Save changes" : "Add holding"
				})]
			})
		]
	});
}
function Field({ label, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex flex-col gap-2", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, { children: label }), children]
	});
}
//#endregion
export { TypePicker as n, HoldingForm as t };
