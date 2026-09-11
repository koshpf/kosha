import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as createRootRoute, b as useRouter, g as createFileRoute, h as lazyRouteComponent, l as Scripts, m as Outlet, p as createRouter, u as HeadContent } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as yahooSymbol, i as mfQuoteKey, r as mfCode, t as FALLBACK_MARKET } from "./symbols-De4dsrfp.mjs";
import { n as TriangleAlert } from "../_libs/lucide-react.mjs";
import { a as union, i as string, n as number, r as object, t as literal } from "../_libs/zod.mjs";
import { n as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { n as create, t as persist } from "../_libs/zustand.mjs";
import { t as format } from "../_libs/date-fns.mjs";
import { t as Provider } from "../_libs/radix-ui__react-tooltip.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/asset-types-CcjURgSi.js
var ASSET_TYPES = [
	{
		id: "indian_stock",
		label: "Indian stock",
		shortLabel: "IN stock",
		hint: "NSE / BSE ticker",
		group: "Markets",
		quoted: true,
		manual: false
	},
	{
		id: "us_stock",
		label: "US / international stock",
		shortLabel: "US stock",
		hint: "NYSE, Nasdaq, and others",
		group: "Markets",
		quoted: true,
		manual: false
	},
	{
		id: "indian_mf",
		label: "Indian mutual fund",
		shortLabel: "Mutual fund",
		hint: "Scheme name or AMFI code",
		group: "Markets",
		quoted: true,
		manual: false
	},
	{
		id: "etf",
		label: "ETF",
		shortLabel: "ETF",
		hint: "India or US listed",
		group: "Markets",
		quoted: true,
		manual: false
	},
	{
		id: "physical_gold",
		label: "Physical gold",
		shortLabel: "Gold",
		hint: "Grams, 22K or 24K",
		group: "Hard assets",
		quoted: true,
		manual: true
	},
	{
		id: "tata_aia",
		label: "Tata AIA Smart SIP",
		shortLabel: "Tata AIA",
		hint: "Insurance-linked investment",
		group: "Insurance",
		quoted: false,
		manual: true
	},
	{
		id: "usd_cash",
		label: "USD / foreign currency",
		shortLabel: "USD cash",
		hint: "Dollar or other FX cash",
		group: "Cash",
		quoted: true,
		manual: false
	},
	{
		id: "bank",
		label: "Bank account",
		shortLabel: "Bank",
		hint: "Savings or current balance",
		group: "Cash",
		quoted: false,
		manual: true
	},
	{
		id: "rd",
		label: "Recurring deposit",
		shortLabel: "RD",
		hint: "Current RD value",
		group: "Deposits",
		quoted: false,
		manual: true
	},
	{
		id: "fd",
		label: "Fixed deposit",
		shortLabel: "FD",
		hint: "Principal and current value",
		group: "Deposits",
		quoted: false,
		manual: true
	},
	{
		id: "other",
		label: "Other",
		shortLabel: "Other",
		hint: "PPF, NPS, crypto, property",
		group: "Other",
		quoted: false,
		manual: true
	}
];
var ASSET_TYPE_MAP = Object.fromEntries(ASSET_TYPES.map((item) => [item.id, item]));
function typeShortLabel(type) {
	return ASSET_TYPE_MAP[type].shortLabel;
}
//#endregion
//#region node_modules/.nitro/vite/services/ssr/assets/router-CUJh-yqh.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var __defProp = Object.defineProperty;
var __exportAll = (all, no_symbols) => {
	let target = {};
	for (var name in all) __defProp(target, name, {
		get: all[name],
		enumerable: true
	});
	if (!no_symbols) __defProp(target, Symbol.toStringTag, { value: "Module" });
	return target;
};
var FALLBACK_MESSAGE = "An unexpected error occurred. Try reloading the page.";
function errorMessage(error) {
	if (error instanceof Error && error.message) return error.message;
	if (typeof error === "string" && error) return error;
	return FALLBACK_MESSAGE;
}
function AppErrorComponent({ error }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
		className: "flex min-h-screen flex-col items-center justify-center gap-3 px-6 text-center bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-50",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-red-500",
				"aria-hidden": "true",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, {
					className: "size-10",
					strokeWidth: 2
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-lg font-semibold",
				children: "Something went wrong"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "max-w-md text-sm break-words text-zinc-500 dark:text-zinc-400",
				children: errorMessage(error)
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var CONNECTOR_TOKEN_READY_EVENT = "grok:connector-token-ready";
function isGrokEmbedderOrigin(origin) {
	try {
		const url = new URL(origin);
		if (url.protocol !== "https:" && url.protocol !== "http:") return false;
		const host = url.hostname.toLowerCase();
		if (host === "grok.com" || host.endsWith(".grok.com")) return true;
		if (host === "localhost" || host === "127.0.0.1" || host === "[::1]") return true;
		return false;
	} catch {
		return false;
	}
}
function isSandboxPreviewGuestHost(hostname) {
	const host = hostname.toLowerCase();
	return host === "grok-sandbox.com" || host.endsWith(".grok-sandbox.com");
}
function isRemintPreviewPair(guestHost, parentHost) {
	const guest = guestHost.toLowerCase();
	const parent = parentHost.toLowerCase();
	const i = guest.indexOf(".preview.");
	if (i <= 0) return false;
	const label = guest.slice(0, i);
	const rest = guest.slice(i + 9);
	if (label.includes(".") || !rest.includes(".")) return false;
	return parent === rest || parent === `grok.${rest}`;
}
function resolveParentEmbedderOrigin(parentIsSelf, referrer, ancestorOrigin, guestHostname = "") {
	if (parentIsSelf) return null;
	for (const candidate of [referrer, ancestorOrigin ?? ""].filter(Boolean)) try {
		const url = new URL(candidate.includes("://") ? candidate : `https://${candidate}`);
		if (url.protocol !== "https:" && url.protocol !== "http:") continue;
		if (isGrokEmbedderOrigin(url.origin)) return url.origin;
		if (isSandboxPreviewGuestHost(guestHostname) || isRemintPreviewPair(guestHostname, url.hostname)) return url.origin;
	} catch {}
	return null;
}
/**
* Guest side of the grok-web ↔ sandbox preview postMessage bridge.
*
* Activates only when this page is framed by an allowlisted Grok embedder.
* Top-level runs (download/export, local `npm run dev`, deployed sites) noop.
*/
var PREVIEW_BRIDGE_CHANNEL = "grok-preview-bridge";
var EnvelopeSchema = object({
	channel: literal(PREVIEW_BRIDGE_CHANNEL),
	version: number().int().positive(),
	type: string().min(1)
});
var HelloSchema = EnvelopeSchema.extend({ type: literal("hello") });
var NavigateSchema = EnvelopeSchema.extend({
	type: literal("navigate"),
	path: string().min(1)
});
var HistorySchema = EnvelopeSchema.extend({
	type: literal("history"),
	delta: union([literal(-1), literal(1)])
});
var ConnectorTokenReadySchema = EnvelopeSchema.extend({ type: literal("connector-token-ready") });
function isSafeBridgePath(path) {
	if (!path.startsWith("/") || path.startsWith("//") || path.includes("\\")) return false;
	try {
		return new URL(path, "https://preview.invalid").origin === "https://preview.invalid";
	} catch {
		return false;
	}
}
/**
* Origin of the Grok embedder framing this page, or null when the page runs
* top-level (download/export, local `npm run dev`, deployed sites) or under a
* non-Grok parent. Client-only; null during SSR.
*/
function resolveCurrentEmbedderOrigin() {
	if (typeof window === "undefined") return null;
	const ancestorOrigin = typeof location.ancestorOrigins !== "undefined" && location.ancestorOrigins.length > 0 ? location.ancestorOrigins[0] : null;
	return resolveParentEmbedderOrigin(window.parent === window, document.referrer, ancestorOrigin, window.location.hostname);
}
/**
* Install host↔guest messaging. Returns a dispose function.
* Noops (returns a no-op dispose) when not embedded under a Grok parent.
*/
function installPreviewHostBridge(options = {}) {
	const parentOrigin = resolveCurrentEmbedderOrigin();
	if (parentOrigin === null) return () => {};
	const ROOT_STATE_KEY = "__grokPreviewBridgeRoot";
	const originalPushState = window.history.pushState.bind(window.history);
	const originalReplaceState = window.history.replaceState.bind(window.history);
	const isAtHistoryRoot = () => {
		const state = window.history.state;
		return Boolean(state && typeof state === "object" && state[ROOT_STATE_KEY] === true);
	};
	try {
		const current = window.history.state;
		if (!(current !== null && typeof current === "object" && Object.prototype.hasOwnProperty.call(current, ROOT_STATE_KEY))) {
			const isRoot = window.history.length <= 1;
			originalReplaceState(current && typeof current === "object" ? {
				...current,
				[ROOT_STATE_KEY]: isRoot
			} : { [ROOT_STATE_KEY]: isRoot }, "", window.location.href);
		}
	} catch {}
	const post = (message) => {
		window.parent.postMessage(message, parentOrigin);
	};
	const reportLocation = () => {
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "location",
			path: window.location.pathname || "/",
			search: window.location.search,
			hash: window.location.hash
		});
	};
	const reportRoutes = () => {
		const paths = options.getRoutePaths?.() ?? [];
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "routes",
			paths
		});
	};
	const defaultNavigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		try {
			const url = new URL(path, window.location.origin);
			if (url.origin !== window.location.origin) return;
			const next = `${url.pathname}${url.search}${url.hash}`;
			window.history.pushState(window.history.state, "", next);
			window.dispatchEvent(new PopStateEvent("popstate", { state: window.history.state }));
		} catch {}
	};
	const navigate = (path) => {
		if (!isSafeBridgePath(path)) return;
		if (options.navigate) {
			options.navigate(path);
			return;
		}
		defaultNavigate(path);
	};
	const announce = () => {
		reportLocation();
		reportRoutes();
		post({
			channel: PREVIEW_BRIDGE_CHANNEL,
			version: 1,
			type: "ready"
		});
	};
	const onHello = (data) => {
		if (!HelloSchema.safeParse(data).success) return;
		announce();
	};
	const onNavigate = (data) => {
		const parsed = NavigateSchema.safeParse(data);
		if (!parsed.success) return;
		navigate(parsed.data.path);
		queueMicrotask(reportLocation);
	};
	const onHistory = (data) => {
		const parsed = HistorySchema.safeParse(data);
		if (!parsed.success) return;
		if (parsed.data.delta === -1 && isAtHistoryRoot()) return;
		window.history.go(parsed.data.delta);
	};
	const onConnectorTokenReady = (data) => {
		if (!ConnectorTokenReadySchema.safeParse(data).success) return;
		window.dispatchEvent(new Event(CONNECTOR_TOKEN_READY_EVENT));
	};
	const hostMessageHandlers = /* @__PURE__ */ new Map([
		["hello", onHello],
		["navigate", onNavigate],
		["history", onHistory],
		["connector-token-ready", onConnectorTokenReady]
	]);
	const onMessage = (event) => {
		if (event.source !== window.parent) return;
		if (event.origin !== parentOrigin) return;
		const envelope = EnvelopeSchema.safeParse(event.data);
		if (!envelope.success || envelope.data.version !== 1) return;
		hostMessageHandlers.get(envelope.data.type)?.(event.data);
	};
	const onPopState = () => {
		reportLocation();
	};
	const onHashChange = () => {
		reportLocation();
	};
	window.history.pushState = (data, unused, url) => {
		const next = data && typeof data === "object" ? {
			...data,
			[ROOT_STATE_KEY]: false
		} : data;
		originalPushState(next, unused, url);
		reportLocation();
	};
	window.history.replaceState = (data, unused, url) => {
		const next = isAtHistoryRoot() ? {
			...data && typeof data === "object" ? data : {},
			[ROOT_STATE_KEY]: true
		} : data;
		originalReplaceState(next, unused, url);
		reportLocation();
	};
	window.addEventListener("message", onMessage);
	window.addEventListener("popstate", onPopState);
	window.addEventListener("hashchange", onHashChange);
	announce();
	return () => {
		window.removeEventListener("message", onMessage);
		window.removeEventListener("popstate", onPopState);
		window.removeEventListener("hashchange", onHashChange);
		window.history.pushState = originalPushState;
		window.history.replaceState = originalReplaceState;
	};
}
/** Collect static path patterns from a TanStack route tree (best-effort). */
function collectRoutePathsFromTree(routeTree) {
	const paths = /* @__PURE__ */ new Set();
	const walk = (node) => {
		if (!node || typeof node !== "object") return;
		const record = node;
		const full = typeof record.fullPath === "string" ? record.fullPath : typeof record.path === "string" ? record.path : null;
		if (full !== null && full !== "") paths.add(full.startsWith("/") ? full : `/${full}`);
		else if (full === "") paths.add("/");
		const children = record.children;
		if (Array.isArray(children)) for (const child of children) walk(child);
		else if (children && typeof children === "object") for (const child of Object.values(children)) walk(child);
	};
	walk(routeTree);
	return [...paths];
}
/**
* Mount once in `__root.tsx` so the Grok preview chrome can drive navigation
* (and later receive registered routes). Noops when the app is not embedded.
*/
function PreviewHostBridge() {
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		return installPreviewHostBridge({
			navigate: (path) => {
				router.history.push(path);
			},
			getRoutePaths: () => collectRoutePathsFromTree(router.routeTree)
		});
	}, [router]);
	return null;
}
var t0 = Date.parse("2026-04-18T09:30:00+05:30");
var SAMPLE_HOLDINGS = [
	{
		id: "hld_rel",
		name: "Reliance Industries",
		type: "indian_stock",
		ticker: "RELIANCE",
		exchange: "NSE",
		quantity: 12,
		avgPrice: 1284,
		currency: "INR",
		costBasisInr: 15408,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_infy",
		name: "Infosys",
		type: "indian_stock",
		ticker: "INFY",
		exchange: "NSE",
		quantity: 20,
		avgPrice: 1472,
		currency: "INR",
		costBasisInr: 29440,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_aapl",
		name: "Apple",
		type: "us_stock",
		ticker: "AAPL",
		exchange: "US",
		quantity: 8,
		avgPrice: 192.4,
		currency: "USD",
		costBasisInr: 131520,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_ppfas",
		name: "Parag Parikh Flexi Cap Direct Growth",
		type: "indian_mf",
		ticker: "122639",
		quantity: 185.52,
		avgPrice: 72.4,
		currency: "INR",
		costBasisInr: 13432,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_bees",
		name: "Nippon India Nifty 50 BeES",
		type: "etf",
		ticker: "NIFTYBEES",
		exchange: "NSE",
		quantity: 150,
		avgPrice: 245,
		currency: "INR",
		costBasisInr: 36750,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_gold",
		name: "Family jewellery",
		type: "physical_gold",
		quantity: 48,
		avgPrice: 6250,
		currency: "INR",
		costBasisInr: 3e5,
		purity: 22,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_aia",
		name: "Tata AIA Smart SIP",
		type: "tata_aia",
		quantity: 1,
		avgPrice: 42e4,
		currency: "INR",
		costBasisInr: 42e4,
		manualValueInr: 468500,
		notes: "Fortune Pro / Smart SIP, annual premium ₹60,000",
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_usd",
		name: "USD savings",
		type: "usd_cash",
		quantity: 3200,
		avgPrice: 83.1,
		currency: "USD",
		costBasisInr: 265920,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_hdfc",
		name: "HDFC Bank savings",
		type: "bank",
		quantity: 285e3,
		avgPrice: 1,
		currency: "INR",
		costBasisInr: 285e3,
		manualValueInr: 285e3,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_rd",
		name: "SBI recurring deposit",
		type: "rd",
		quantity: 1,
		avgPrice: 9e4,
		currency: "INR",
		costBasisInr: 9e4,
		manualValueInr: 96480,
		notes: "₹5,000 / month, 18 months elapsed",
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_fd",
		name: "ICICI tax-saver FD",
		type: "fd",
		quantity: 1,
		avgPrice: 5e5,
		currency: "INR",
		costBasisInr: 5e5,
		manualValueInr: 538200,
		createdAt: t0,
		updatedAt: t0
	},
	{
		id: "hld_ppf",
		name: "Public Provident Fund",
		type: "other",
		quantity: 1,
		avgPrice: 31e4,
		currency: "INR",
		costBasisInr: 31e4,
		manualValueInr: 348600,
		notes: "PPF, SBI",
		createdAt: t0,
		updatedAt: t0
	}
];
var VAULT_KEY = "kosha-portfolio-v1";
var IDB_NAME = "kosha-vault";
var IDB_STORE = "kv";
function isHolding(value) {
	if (!value || typeof value !== "object") return false;
	const row = value;
	return typeof row.id === "string" && typeof row.name === "string" && typeof row.type === "string" && typeof row.quantity === "number";
}
function parseVault(raw) {
	const data = JSON.parse(raw);
	const source = Array.isArray(data.holdings) ? data : data.state && Array.isArray(data.state.holdings) ? data.state : null;
	if (!source || !Array.isArray(source.holdings)) throw new Error("Not a Kosha backup");
	const holdings = source.holdings.filter(isHolding);
	if (holdings.length === 0 && source.holdings.length > 0) throw new Error("Backup holdings look invalid");
	return {
		holdings,
		history: Array.isArray(source.history) ? source.history : [],
		lastPrices: source.lastPrices ?? null,
		theme: source.theme === "light" ? "light" : "dark",
		showUsd: source.showUsd !== false,
		seeded: true
	};
}
function serializeBackup(payload) {
	const file = {
		app: "kosha",
		version: 1,
		exportedAt: (/* @__PURE__ */ new Date()).toISOString(),
		...payload
	};
	return JSON.stringify(file, null, 2);
}
function downloadBackup(json) {
	const stamp = (/* @__PURE__ */ new Date()).toLocaleDateString("en-GB").replace(/\//g, "-");
	const blob = new Blob([json], { type: "application/json" });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = `kosha-backup-${stamp}.json`;
	a.click();
	URL.revokeObjectURL(url);
}
function openIdb() {
	if (typeof indexedDB === "undefined") return Promise.resolve(null);
	return new Promise((resolve) => {
		try {
			const req = indexedDB.open(IDB_NAME, 1);
			req.onupgradeneeded = () => {
				if (!req.result.objectStoreNames.contains(IDB_STORE)) req.result.createObjectStore(IDB_STORE);
			};
			req.onsuccess = () => resolve(req.result);
			req.onerror = () => resolve(null);
		} catch {
			resolve(null);
		}
	});
}
async function idbGet(name) {
	const db = await openIdb();
	if (!db) return null;
	return new Promise((resolve) => {
		try {
			const req = db.transaction(IDB_STORE, "readonly").objectStore(IDB_STORE).get(name);
			req.onsuccess = () => resolve(req.result ?? null);
			req.onerror = () => resolve(null);
		} catch {
			resolve(null);
		}
	});
}
async function idbSet(name, value) {
	const db = await openIdb();
	if (!db) return;
	await new Promise((resolve) => {
		try {
			const tx = db.transaction(IDB_STORE, "readwrite");
			tx.objectStore(IDB_STORE).put(value, name);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		} catch {
			resolve();
		}
	});
}
async function idbDel(name) {
	const db = await openIdb();
	if (!db) return;
	await new Promise((resolve) => {
		try {
			const tx = db.transaction(IDB_STORE, "readwrite");
			tx.objectStore(IDB_STORE).delete(name);
			tx.oncomplete = () => resolve();
			tx.onerror = () => resolve();
		} catch {
			resolve();
		}
	});
}
var usePortfolio = create()(persist((set, get) => ({
	holdings: [],
	history: [],
	lastPrices: null,
	theme: "dark",
	showUsd: true,
	seeded: false,
	hasHydrated: false,
	ensureSeeded: () => {
		const { seeded, holdings } = get();
		if (seeded) return;
		if (holdings.length > 0) {
			set({ seeded: true });
			return;
		}
		set({
			holdings: SAMPLE_HOLDINGS,
			seeded: true
		});
	},
	setHydrated: () => set({ hasHydrated: true }),
	addHolding: (holding) => set({ holdings: [...get().holdings, holding] }),
	updateHolding: (id, patch) => set({ holdings: get().holdings.map((row) => row.id === id ? {
		...row,
		...patch,
		updatedAt: Date.now()
	} : row) }),
	removeHolding: (id) => set({ holdings: get().holdings.filter((row) => row.id !== id) }),
	setPrices: (prices) => set({ lastPrices: prices }),
	setHistory: (history) => set({ history }),
	setTheme: (theme) => set({ theme }),
	setShowUsd: (showUsd) => set({ showUsd }),
	importVault: (payload) => set({
		holdings: payload.holdings,
		history: payload.history,
		lastPrices: payload.lastPrices,
		theme: payload.theme,
		showUsd: payload.showUsd,
		seeded: true
	}),
	snapshot: () => {
		const s = get();
		return {
			holdings: s.holdings,
			history: s.history,
			lastPrices: s.lastPrices,
			theme: s.theme,
			showUsd: s.showUsd,
			seeded: s.seeded
		};
	}
}), {
	name: VAULT_KEY,
	storage: {
		getItem: async (name) => {
			try {
				const raw = localStorage.getItem(name);
				if (raw) {
					const parsed = JSON.parse(raw);
					idbSet(name, parsed);
					return parsed;
				}
			} catch {}
			return idbGet(name);
		},
		setItem: (name, value) => {
			try {
				localStorage.setItem(name, JSON.stringify(value));
			} catch {}
			idbSet(name, value);
		},
		removeItem: (name) => {
			try {
				localStorage.removeItem(name);
			} catch {}
			idbDel(name);
		}
	},
	skipHydration: true,
	partialize: (state) => ({
		holdings: state.holdings,
		history: state.history,
		lastPrices: state.lastPrices,
		theme: state.theme,
		showUsd: state.showUsd,
		seeded: state.seeded
	})
}));
function applyTheme(theme) {
	if (typeof document === "undefined") return;
	const root = document.documentElement;
	root.classList.toggle("dark", theme === "dark");
	root.classList.toggle("light", theme === "light");
	root.style.colorScheme = theme;
}
var inrFull = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 0
});
var inrPrecise = new Intl.NumberFormat("en-IN", {
	style: "currency",
	currency: "INR",
	maximumFractionDigits: 2
});
var inrNumber = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 });
var inrNumberPrecise = new Intl.NumberFormat("en-IN", {
	minimumFractionDigits: 2,
	maximumFractionDigits: 2
});
var usdFull = new Intl.NumberFormat("en-US", {
	style: "currency",
	currency: "USD",
	maximumFractionDigits: 2
});
var qtyFmt = new Intl.NumberFormat("en-IN", { maximumFractionDigits: 4 });
function formatInr(value, precise = false) {
	if (!Number.isFinite(value)) return "₹0";
	const rounded = precise ? value : Math.round(value);
	return (precise ? inrPrecise : inrFull).format(rounded);
}
function formatInrNumber(value, precise = false) {
	if (!Number.isFinite(value)) return "0";
	return (precise ? inrNumberPrecise : inrNumber).format(precise ? value : Math.round(value));
}
function formatUsd(value) {
	if (!Number.isFinite(value)) return "$0.00";
	return usdFull.format(value);
}
function formatSignedInr(value) {
	const abs = formatInr(Math.abs(value));
	if (Math.abs(value) < .5) return abs;
	return value > 0 ? `+${abs}` : `-${abs}`;
}
function formatPct(value) {
	if (!Number.isFinite(value)) return "0.00%";
	const abs = Math.abs(value).toFixed(2);
	if (Math.abs(value) < .005) return "0.00%";
	return value > 0 ? `+${abs}%` : `-${abs}%`;
}
function formatQty(value) {
	if (!Number.isFinite(value)) return "0";
	return qtyFmt.format(value);
}
function formatGoldGrams(value) {
	if (!Number.isFinite(value)) return "0 g";
	const digits = Math.abs(value) >= 100 ? 1 : 2;
	return `${new Intl.NumberFormat("en-IN", {
		minimumFractionDigits: digits,
		maximumFractionDigits: digits
	}).format(value)} g`;
}
function formatBtcNumber(value) {
	if (!Number.isFinite(value)) return "0";
	const abs = Math.abs(value);
	const digits = abs >= 1 ? 4 : abs >= .01 ? 6 : 8;
	return value.toFixed(digits);
}
function formatDate(ts) {
	const date = typeof ts === "number" || ts instanceof Date ? new Date(ts) : parseIsoDate(ts);
	if (Number.isNaN(date.getTime())) return "—";
	return format(date, "dd/MM/yyyy");
}
function formatDateTime(ts) {
	const date = new Date(ts);
	if (Number.isNaN(date.getTime())) return "—";
	return format(date, "dd/MM/yyyy HH:mm");
}
function relativeTime(ts) {
	const delta = Date.now() - ts;
	if (!Number.isFinite(delta) || ts <= 0) return "Never";
	const mins = Math.floor(delta / 6e4);
	if (mins < 1) return "Just now";
	if (mins < 60) return `${mins} min ago`;
	const hours = Math.floor(mins / 60);
	if (hours < 24) return `${hours}h ago`;
	const days = Math.floor(hours / 24);
	if (days === 1) return "Yesterday";
	if (days < 14) return `${days}d ago`;
	return formatDate(ts);
}
function todayKey(date = /* @__PURE__ */ new Date()) {
	return format(date, "yyyy-MM-dd");
}
function parseIsoDate(value) {
	if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
		const [y, m, d] = value.split("-").map(Number);
		return new Date(y, (m ?? 1) - 1, d ?? 1);
	}
	return new Date(value);
}
function parseAmount(raw) {
	const cleaned = raw.replace(/,/g, "").replace(/₹/g, "").replace(/\$/g, "").trim();
	if (!cleaned) return 0;
	const n = Number(cleaned);
	return Number.isFinite(n) ? n : NaN;
}
function pnlTone(value) {
	if (value > .5) return "gain";
	if (value < -.5) return "loss";
	return "flat";
}
function goldPriceForPurity(market, purity = 24) {
	return market.goldInrPerGram24k * (purity / 24);
}
function valueHolding(holding, market) {
	const costBasisInr = holding.costBasisInr;
	let currentValueInr = 0;
	let pricePerUnit = null;
	let priceCurrency = null;
	let dayChangeInr = 0;
	let quoted = false;
	const ySym = yahooSymbol(holding);
	const code = mfCode(holding);
	const quote = ySym ? market.quotes[ySym] : code ? market.quotes[mfQuoteKey(code)] : void 0;
	switch (holding.type) {
		case "indian_stock":
		case "etf":
		case "us_stock":
		case "indian_mf":
			if (quote) {
				quoted = true;
				pricePerUnit = quote.price;
				priceCurrency = quote.currency;
				const fx = quote.currency === "USD" ? market.usdInr : 1;
				currentValueInr = holding.quantity * quote.price * fx;
				if (quote.prevClose != null) dayChangeInr = holding.quantity * (quote.price - quote.prevClose) * fx;
			} else if (holding.manualValueInr != null) currentValueInr = holding.manualValueInr;
			else {
				const fx = holding.currency === "USD" ? market.usdInr : 1;
				currentValueInr = holding.quantity * holding.avgPrice * fx;
				pricePerUnit = holding.avgPrice;
				priceCurrency = holding.currency;
			}
			break;
		case "physical_gold": {
			const livePerGram = goldPriceForPurity(market, holding.purity ?? 24);
			pricePerUnit = livePerGram;
			priceCurrency = "INR";
			quoted = holding.manualValueInr == null;
			if (holding.manualValueInr != null) currentValueInr = holding.manualValueInr;
			else currentValueInr = holding.quantity * livePerGram;
			break;
		}
		case "usd_cash":
			pricePerUnit = market.usdInr;
			priceCurrency = "INR";
			quoted = true;
			currentValueInr = holding.quantity * market.usdInr;
			break;
		case "tata_aia":
		case "bank":
		case "rd":
		case "fd":
		case "other": currentValueInr = holding.manualValueInr ?? (holding.quantity > 0 && holding.avgPrice > 0 ? holding.quantity * holding.avgPrice : costBasisInr);
	}
	const pnlInr = currentValueInr - costBasisInr;
	const pnlPct = costBasisInr !== 0 ? pnlInr / costBasisInr * 100 : 0;
	return {
		holding,
		currentValueInr,
		costBasisInr,
		pnlInr,
		pnlPct,
		dayChangeInr,
		pricePerUnit,
		priceCurrency,
		lastUpdated: quoted ? market.asOf : holding.updatedAt,
		quoted
	};
}
function aggregate(views, market, yesterday) {
	const currentInr = views.reduce((sum, row) => sum + row.currentValueInr, 0);
	const costInr = views.reduce((sum, row) => sum + row.costBasisInr, 0);
	const quotedDay = views.reduce((sum, row) => sum + row.dayChangeInr, 0);
	const dayChangeInr = yesterday && yesterday.date !== todayKey() ? currentInr - yesterday.inr : quotedDay;
	const pnlInr = currentInr - costInr;
	const goldGrams = market.goldInrPerGram24k > 0 ? currentInr / market.goldInrPerGram24k : 0;
	const btc = market.btcInr > 0 ? currentInr / market.btcInr : 0;
	const usd = market.usdInr > 0 ? currentInr / market.usdInr : 0;
	return {
		currentInr,
		costInr,
		pnlInr,
		pnlPct: costInr !== 0 ? pnlInr / costInr * 100 : 0,
		dayChangeInr,
		goldGrams,
		btc,
		usd
	};
}
function allocationByType(views) {
	const map = /* @__PURE__ */ new Map();
	for (const row of views) map.set(row.holding.type, (map.get(row.holding.type) ?? 0) + row.currentValueInr);
	return [...map.entries()].map(([type, value]) => ({
		type,
		value
	})).filter((row) => row.value > 0).sort((a, b) => b.value - a.value);
}
function seedHistory(currentInr, market, days = 90) {
	const goldPx = market.goldInrPerGram24k || FALLBACK_MARKET.goldInrPerGram24k;
	const btcPx = market.btcInr || FALLBACK_MARKET.btcInr;
	const points = [];
	const start = currentInr * .86;
	for (let i = days; i >= 0; i -= 1) {
		const t = (days - i) / days;
		const wave = Math.sin(i / 5.5) * .012 + Math.sin(i / 13) * .008;
		const drift = t * .14;
		const wobble = i * 17 % 10 / 10 * .01 - .005;
		let inr = start * (1 + drift + wave + wobble);
		if (i === 0) inr = currentInr;
		const date = /* @__PURE__ */ new Date();
		date.setHours(18, 0, 0, 0);
		date.setDate(date.getDate() - i);
		const goldOff = 1 + Math.sin(i / 9) * .015;
		const btcOff = 1 + Math.sin(i / 7 + 1.2) * .04;
		points.push({
			date: todayKey(date),
			inr,
			goldG: inr / (goldPx * goldOff),
			btc: inr / (btcPx * btcOff)
		});
	}
	return points;
}
function upsertTodaySnapshot(history, totals) {
	const date = todayKey();
	const point = {
		date,
		inr: totals.currentInr,
		goldG: totals.goldGrams,
		btc: totals.btc
	};
	return [...history.filter((row) => row.date !== date), point].sort((a, b) => a.date.localeCompare(b.date)).slice(-180);
}
function yesterdayPoint(history) {
	const today = todayKey();
	const prior = history.filter((row) => row.date < today);
	return prior[prior.length - 1];
}
function usePortfolioView() {
	const holdings = usePortfolio((s) => s.holdings);
	const stored = usePortfolio((s) => s.lastPrices);
	const history = usePortfolio((s) => s.history);
	const hasHydrated = usePortfolio((s) => s.hasHydrated);
	const market = stored ?? FALLBACK_MARKET;
	const views = (0, import_react.useMemo)(() => holdings.map((holding) => valueHolding(holding, market)), [holdings, market]);
	const yesterday = (0, import_react.useMemo)(() => yesterdayPoint(history), [history]);
	return {
		holdings,
		views,
		totals: (0, import_react.useMemo)(() => aggregate(views, market, yesterday), [
			views,
			market,
			yesterday
		]),
		market,
		history,
		hasHydrated,
		yesterday
	};
}
function syncHistoryFromTotals() {
	const { history, lastPrices, holdings, setHistory } = usePortfolio.getState();
	const market = lastPrices ?? FALLBACK_MARKET;
	const totals = aggregate(holdings.map((holding) => valueHolding(holding, market)), market, yesterdayPoint(history));
	setHistory(history.length === 0 ? seedHistory(totals.currentInr, market) : upsertTodaySnapshot(history, totals));
}
function finishBoot() {
	const state = usePortfolio.getState();
	state.ensureSeeded();
	state.setHydrated();
	applyTheme(usePortfolio.getState().theme);
	if (usePortfolio.getState().history.length === 0) syncHistoryFromTotals();
}
function HydratePortfolio() {
	(0, import_react.useEffect)(() => {
		let done = false;
		const complete = () => {
			if (done) return;
			done = true;
			finishBoot();
		};
		const timer = window.setTimeout(complete, 1600);
		Promise.resolve(usePortfolio.persist.rehydrate()).catch(() => void 0).finally(() => {
			window.clearTimeout(timer);
			complete();
		});
		return () => window.clearTimeout(timer);
	}, []);
	return null;
}
function AppProviders({ children }) {
	const [client] = (0, import_react.useState)(() => new QueryClient({ defaultOptions: { queries: {
		retry: 0,
		refetchOnWindowFocus: false,
		gcTime: 18e5
	} } }));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(QueryClientProvider, {
		client,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HydratePortfolio, {}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				position: "bottom-right",
				theme: "system",
				toastOptions: { className: "!bg-card !text-foreground !border-border" }
			})
		]
	});
}
function TooltipProvider({ children, delayDuration = 250 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Provider, {
		delayDuration,
		children
	});
}
var styles_default = "/assets/styles-CuWmhz9f.css";
var APP_NAME = "Kosha";
var Route$5 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: APP_NAME },
			{
				name: "description",
				content: "Track Indian investments and net worth in rupees, gold grams, and bitcoin."
			},
			{
				name: "theme-color",
				content: "#0c0d0c"
			}
		],
		links: [
			{
				rel: "icon",
				type: "image/svg+xml",
				href: "/favicon.svg"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "manifest",
				href: "/__grok/manifest.webmanifest"
			},
			{
				rel: "apple-touch-icon",
				href: "/__grok/icon-180.png"
			},
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,500;0,9..144,600;1,9..144,500&family=IBM+Plex+Sans:wght@400;500;600&display=swap"
			}
		]
	}),
	component: RootDocument
});
function RootDocument() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		className: "dark antialiased",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", {
			className: "min-h-dvh bg-background text-foreground",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PreviewHostBridge, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppProviders, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TooltipProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
			]
		})]
	});
}
var $$splitComponentImporter$4 = () => import("./routes-Bu8_PE1y.mjs");
var Route$4 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./holdings-Apyn8jYo.mjs");
var Route$3 = createFileRoute("/holdings")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./settings-9_kv9DT5.mjs");
var Route$2 = createFileRoute("/settings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./holdings_._holdingId-BjutepOO.mjs");
var Route$1 = createFileRoute("/holdings_/$holdingId")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./holdings_.new-DjPAz1nk.mjs");
function parseType(value) {
	return typeof value === "string" && value in ASSET_TYPE_MAP ? value : void 0;
}
var Route = createFileRoute("/holdings_/new")({
	validateSearch: (search) => {
		const type = parseType(search.type);
		return type ? { type } : {};
	},
	component: lazyRouteComponent($$splitComponentImporter, "component")
});
var rootRouteChildren = {
	IndexRoute: Route$4.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$5
	}),
	HoldingsRoute: Route$3.update({
		id: "/holdings",
		path: "/holdings",
		getParentRoute: () => Route$5
	}),
	SettingsRoute: Route$2.update({
		id: "/settings",
		path: "/settings",
		getParentRoute: () => Route$5
	}),
	HoldingsHoldingIdRoute: Route$1.update({
		id: "/holdings_/$holdingId",
		path: "/holdings/$holdingId",
		getParentRoute: () => Route$5
	}),
	HoldingsNewRoute: Route.update({
		id: "/holdings_/new",
		path: "/holdings/new",
		getParentRoute: () => Route$5
	})
};
var routeTree = Route$5._addFileChildren(rootRouteChildren)._addFileTypes();
var router_exports = /* @__PURE__ */ __exportAll({ getRouter: () => getRouter });
function getRouter() {
	return createRouter({
		routeTree,
		defaultErrorComponent: AppErrorComponent,
		scrollRestoration: true
	});
}
//#endregion
export { downloadBackup as C, ASSET_TYPE_MAP as D, ASSET_TYPES as E, typeShortLabel as O, usePortfolio as S, serializeBackup as T, formatUsd as _, usePortfolioView as a, relativeTime as b, formatBtcNumber as c, formatGoldGrams as d, formatInr as f, formatSignedInr as g, formatQty as h, syncHistoryFromTotals as i, formatDate as l, formatPct as m, Route as n, allocationByType as o, formatInrNumber as p, Route$1 as r, goldPriceForPurity as s, router_exports as t, formatDateTime as u, parseAmount as v, parseVault as w, applyTheme as x, pnlTone as y };
