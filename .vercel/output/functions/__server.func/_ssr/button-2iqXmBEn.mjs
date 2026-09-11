import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { d as useRouterState, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { d as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { n as TSS_SERVER_FUNCTION, r as getServerFnById, t as createServerFn } from "./ssr.mjs";
import { n as collectSymbols, t as FALLBACK_MARKET } from "./symbols-De4dsrfp.mjs";
import { c as Plus, d as LayoutDashboard, i as Settings, u as List } from "../_libs/lucide-react.mjs";
import { t as useQuery } from "../_libs/tanstack__react-query.mjs";
import { S as usePortfolio, i as syncHistoryFromTotals } from "./router-CUJh-yqh.mjs";
import { n as clsx, t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-2iqXmBEn.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
var createSsrRpc = (functionId) => {
	const url = "/_serverFn/" + functionId;
	const serverFnMeta = { id: functionId };
	const fn = async (...args) => {
		return (await getServerFnById(functionId, { origin: "server" }))(...args);
	};
	return Object.assign(fn, {
		url,
		serverFnMeta,
		[TSS_SERVER_FUNCTION]: true
	});
};
var fetchMarketQuotes = createServerFn({ method: "POST" }).validator((data) => ({
	yahoo: Array.isArray(data.yahoo) ? data.yahoo.slice(0, 24).map(String) : [],
	mf: Array.isArray(data.mf) ? data.mf.slice(0, 20).map(String) : []
})).handler(createSsrRpc("9d517c9f904e61b744a3f138aaf2b00d752a017c8d627f33386606b4cd7f7947"));
var searchMutualFunds = createServerFn({ method: "POST" }).validator((data) => ({ query: String(data.query ?? "").trim().slice(0, 80) })).handler(createSsrRpc("7d1edf2a6c56c64fb0d012a74a988e16eba249b93eaa17cac596f3d91f9969c1"));
var searchTickers = createServerFn({ method: "POST" }).validator((data) => ({
	query: String(data.query ?? "").trim().slice(0, 40),
	type: String(data.type ?? "")
})).handler(createSsrRpc("b23621a74cd47c1d46b54a639d79ce4b21dd9703d8b8fdba856fa54c7f3ffcfd"));
function PriceSync() {
	const holdings = usePortfolio((s) => s.holdings);
	const hasHydrated = usePortfolio((s) => s.hasHydrated);
	const lastPrices = usePortfolio((s) => s.lastPrices);
	const setPrices = usePortfolio((s) => s.setPrices);
	const symbols = (0, import_react.useMemo)(() => collectSymbols(holdings), [holdings]);
	const query = useQuery({
		queryKey: [
			"quotes",
			symbols.yahoo,
			symbols.mf
		],
		queryFn: async () => {
			const result = await Promise.race([fetchMarketQuotes({ data: symbols }), new Promise((resolve) => {
				window.setTimeout(() => resolve(null), 1e4);
			})]);
			if (!result) throw new Error("price timeout");
			return result;
		},
		enabled: hasHydrated,
		staleTime: 6e4,
		refetchInterval: 3e5
	});
	(0, import_react.useEffect)(() => {
		if (!query.data) return;
		setPrices(query.data);
		syncHistoryFromTotals();
	}, [query.data, setPrices]);
	(0, import_react.useEffect)(() => {
		if (!query.isError || lastPrices) return;
		setPrices({
			...FALLBACK_MARKET,
			asOf: Date.now()
		});
		syncHistoryFromTotals();
	}, [
		query.isError,
		lastPrices,
		setPrices
	]);
	return null;
}
function useRefreshPrices() {
	const holdings = usePortfolio((s) => s.holdings);
	const setPrices = usePortfolio((s) => s.setPrices);
	const symbols = (0, import_react.useMemo)(() => collectSymbols(holdings), [holdings]);
	return async () => {
		try {
			const data = await Promise.race([fetchMarketQuotes({ data: symbols }), new Promise((resolve) => {
				window.setTimeout(() => resolve(null), 1e4);
			})]) ?? {
				...FALLBACK_MARKET,
				asOf: Date.now()
			};
			setPrices(data);
			syncHistoryFromTotals();
			return data;
		} catch {
			const data = {
				...FALLBACK_MARKET,
				asOf: Date.now()
			};
			setPrices(data);
			syncHistoryFromTotals();
			return data;
		}
	};
}
var NAV = [
	{
		to: "/",
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		to: "/holdings",
		label: "Holdings",
		icon: List
	},
	{
		to: "/holdings/new",
		label: "Add",
		icon: Plus
	},
	{
		to: "/settings",
		label: "Settings",
		icon: Settings
	}
];
function AppShell({ children }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-background text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceSync, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
				className: "fixed inset-y-0 left-0 z-30 hidden w-56 border-r border-border bg-background pt-8 pb-6 md:flex md:flex-col",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/",
						className: "px-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-display text-2xl italic tracking-tight",
							children: "Kosha"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mt-1 block text-xs text-muted-foreground",
							children: "Treasury"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "mt-10 flex flex-1 flex-col gap-1 px-3",
						children: NAV.map((item) => {
							const active = item.to === "/" ? pathname === "/" : item.to === "/holdings" ? pathname === "/holdings" : pathname === item.to || pathname.startsWith(`${item.to}/`);
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: item.to,
								"aria-current": active ? "page" : void 0,
								className: cn("flex h-11 items-center gap-3 rounded-md px-3 text-sm transition-colors duration-150", active ? "bg-muted text-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
							}, item.to);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "px-6 text-xs text-subtle",
						children: "Indicative prices. Not advice."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "sticky top-0 z-20 flex h-14 items-center justify-between border-b border-border bg-background/90 px-4 backdrop-blur-sm md:hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-display text-xl italic tracking-tight",
					children: "Kosha"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/holdings/new",
					className: "inline-flex size-11 items-center justify-center rounded-md text-foreground",
					"aria-label": "Add holding",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-5" })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "md:pl-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto w-full max-w-6xl px-4 py-6 pb-32 md:px-8 md:py-8 md:pb-10",
					children
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-20 border-t border-border bg-background/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "grid grid-cols-4",
					children: NAV.map((item) => {
						const active = item.to === "/" ? pathname === "/" : item.to === "/holdings" ? pathname === "/holdings" : pathname === item.to;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex h-14 touch-manipulation flex-col items-center justify-center gap-1 text-xs", active ? "text-foreground" : "text-muted-foreground"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4" }), item.label]
						}) }, item.to);
					})
				})
			})
		]
	});
}
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-[background-color,color,box-shadow,transform,opacity] duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 disabled:pointer-events-none disabled:opacity-40 active:not-disabled:scale-[0.96] [&_svg]:size-4 [&_svg]:shrink-0", {
	variants: {
		variant: {
			default: "bg-primary text-primary-foreground hover:opacity-90",
			secondary: "bg-muted text-foreground hover:bg-border",
			outline: "shadow-[var(--shadow-border)] bg-transparent hover:shadow-[var(--shadow-border-hover)]",
			ghost: "hover:bg-muted",
			destructive: "bg-loss text-paper hover:opacity-90",
			link: "text-foreground underline-offset-4 hover:underline"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 px-3 text-xs",
			lg: "h-12 px-5",
			icon: "size-11",
			"icon-sm": "size-9"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
function Button({ className, variant, size, asChild = false, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size
		}), className),
		...props
	});
}
//#endregion
export { searchMutualFunds as a, cn as i, Button as n, searchTickers as o, buttonVariants as r, useRefreshPrices as s, AppShell as t };
