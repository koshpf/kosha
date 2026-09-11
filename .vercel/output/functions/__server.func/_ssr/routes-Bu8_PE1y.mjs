import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { f as IndianRupee, o as Scale, p as Bitcoin, s as RefreshCw } from "../_libs/lucide-react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { O as typeShortLabel, S as usePortfolio, _ as formatUsd, a as usePortfolioView, b as relativeTime, c as formatBtcNumber, d as formatGoldGrams, f as formatInr, l as formatDate, m as formatPct, o as allocationByType, p as formatInrNumber, s as goldPriceForPurity, u as formatDateTime } from "./router-CUJh-yqh.mjs";
import { i as cn, n as Button, s as useRefreshPrices, t as AppShell } from "./button-2iqXmBEn.mjs";
import { t as PnlText } from "./pnl-BK4qfCGn.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, t as Card } from "./card-C_4TSInD.mjs";
import { a as Area, c as ResponsiveContainer, i as XAxis, l as Tooltip, n as PieChart, o as Pie, r as YAxis, s as Cell, t as AreaChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-Bu8_PE1y.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var SLICE = {
	indian_stock: "var(--color-primary)",
	us_stock: "color-mix(in oklab, var(--color-primary) 70%, var(--color-foreground))",
	indian_mf: "color-mix(in oklab, var(--color-primary) 45%, var(--color-muted-foreground))",
	etf: "color-mix(in oklab, var(--color-foreground) 55%, var(--color-muted))",
	physical_gold: "color-mix(in oklab, var(--color-muted-foreground) 80%, var(--color-primary))",
	tata_aia: "color-mix(in oklab, var(--color-foreground) 35%, var(--color-card))",
	usd_cash: "color-mix(in oklab, var(--color-gain) 55%, var(--color-muted))",
	bank: "color-mix(in oklab, var(--color-foreground) 25%, var(--color-muted))",
	rd: "color-mix(in oklab, var(--color-muted-foreground) 70%, var(--color-card))",
	fd: "color-mix(in oklab, var(--color-muted-foreground) 50%, var(--color-card))",
	other: "color-mix(in oklab, var(--color-subtle) 80%, var(--color-foreground))"
};
function AllocationChart({ views }) {
	const rows = allocationByType(views);
	const total = rows.reduce((sum, row) => sum + row.value, 0);
	const data = rows.map((row) => ({
		name: typeShortLabel(row.type),
		value: row.value,
		type: row.type
	}));
	if (data.length === 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Allocation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-muted-foreground",
			children: "Add a holding to see allocation."
		}) })]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Allocation" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "grid gap-4 md:grid-cols-[minmax(0,1fr)_12rem]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "h-56",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
					width: "100%",
					height: "100%",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(PieChart, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pie, {
						data,
						dataKey: "value",
						nameKey: "name",
						innerRadius: 62,
						outerRadius: 88,
						paddingAngle: 2,
						stroke: "var(--color-card)",
						children: data.map((entry) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cell, { fill: SLICE[entry.type] ?? "var(--color-primary)" }, entry.type))
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
						formatter: (value) => formatInr(Number(value ?? 0)),
						contentStyle: {
							background: "var(--color-card)",
							border: "1px solid var(--color-border)",
							borderRadius: 8,
							color: "var(--color-foreground)"
						}
					})] })
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "flex flex-col justify-center gap-2 text-sm",
				children: data.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
					className: "flex items-center justify-between gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-2 text-muted-foreground",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "size-2 rounded-full",
							style: { background: SLICE[row.type] }
						}), row.name]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "tabular-nums",
						children: total > 0 ? `${(row.value / total * 100).toFixed(1)}%` : "0%"
					})]
				}, row.type))
			})]
		})]
	});
}
var UNITS = [
	{
		id: "inr",
		label: "₹"
	},
	{
		id: "gold",
		label: "Gold"
	},
	{
		id: "btc",
		label: "BTC"
	}
];
function formatUnit(unit, value) {
	if (unit === "gold") return formatGoldGrams(value);
	if (unit === "btc") return formatBtcNumber(value);
	return formatInr(value);
}
function HistoryChart({ history }) {
	const [unit, setUnit] = (0, import_react.useState)("inr");
	const data = (0, import_react.useMemo)(() => history.map((row) => ({
		date: row.date,
		value: unit === "inr" ? row.inr : unit === "gold" ? row.goldG : row.btc
	})), [history, unit]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		className: "h-full",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
			className: "flex-row items-center justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Net worth" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex rounded-md bg-muted p-1",
				children: UNITS.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => setUnit(item.id),
					className: cn("h-8 rounded-sm px-3 text-xs font-medium transition-colors duration-150", unit === item.id ? "bg-card text-foreground shadow-[var(--shadow-border)]" : "text-muted-foreground hover:text-foreground"),
					children: item.label
				}, item.id))
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "h-56",
			children: data.length < 2 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "flex h-full items-center text-sm text-muted-foreground",
				children: "History appears after the first price refresh."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
				width: "100%",
				height: "100%",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AreaChart, {
					data,
					margin: {
						top: 8,
						right: 8,
						left: 0,
						bottom: 0
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
							id: "nw",
							x1: "0",
							y1: "0",
							x2: "0",
							y2: "1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "0%",
								stopColor: "var(--color-primary)",
								stopOpacity: .28
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
								offset: "100%",
								stopColor: "var(--color-primary)",
								stopOpacity: 0
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
							dataKey: "date",
							tickFormatter: (v) => formatDate(String(v)).slice(0, 5),
							tick: {
								fill: "var(--color-muted-foreground)",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							minTickGap: 24
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
							tickFormatter: (v) => unit === "inr" ? `₹${Math.round(Number(v) / 1e5)}L` : unit === "gold" ? `${Math.round(Number(v))}g` : Number(v).toFixed(3),
							tick: {
								fill: "var(--color-muted-foreground)",
								fontSize: 11
							},
							axisLine: false,
							tickLine: false,
							width: 48
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, {
							labelFormatter: (label) => formatDate(String(label)),
							formatter: (value) => formatUnit(unit, Number(value ?? 0)),
							contentStyle: {
								background: "var(--color-card)",
								border: "1px solid var(--color-border)",
								borderRadius: 8,
								color: "var(--color-foreground)"
							}
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Area, {
							type: "monotone",
							dataKey: "value",
							stroke: "var(--color-primary)",
							fill: "url(#nw)",
							strokeWidth: 1.5
						})
					]
				})
			})
		}) })]
	});
}
function NetWorthCards({ totals, market, showUsd }) {
	const cards = [
		{
			key: "inr",
			label: "Indian rupees",
			icon: IndianRupee,
			value: `₹${formatInrNumber(totals.currentInr)}`,
			sub: showUsd ? formatUsd(totals.usd) : "Default currency",
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, { amount: totals.dayChangeInr }),
			extraLabel: "Today"
		},
		{
			key: "gold",
			label: "Gold, 24K equivalent",
			icon: Scale,
			value: formatGoldGrams(totals.goldGrams),
			sub: `at ₹${formatInrNumber(market.goldInrPerGram24k, true)} / g`,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "tabular-nums text-muted-foreground",
				children: [formatUsd(market.goldUsdPerGram), " / g"]
			}),
			extraLabel: "Spot"
		},
		{
			key: "btc",
			label: "Bitcoin",
			icon: Bitcoin,
			value: formatBtcNumber(totals.btc),
			sub: `at ₹${formatInrNumber(market.btcInr)}`,
			extra: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "tabular-nums text-muted-foreground",
				children: formatUsd(market.btcUsd)
			}),
			extraLabel: "Spot"
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "grid gap-3 md:grid-cols-3",
		children: cards.map((card) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			className: "flex flex-col gap-5 p-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
						children: card.label
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(card.icon, { className: "size-4 text-subtle" })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "font-display text-3xl leading-none font-medium tracking-tight tabular-nums md:text-4xl",
					children: card.value
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-muted-foreground",
						children: card.sub
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-subtle",
							children: card.extraLabel
						}), card.extra]
					})]
				})
			]
		}, card.key))
	});
}
function PriceTicker({ market, refreshing, onRefresh }) {
	const gold22 = goldPriceForPurity(market, 22);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-3 rounded-xl bg-card px-4 py-3 shadow-[var(--shadow-border)] md:flex-row md:items-center md:justify-between",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-center gap-x-4 gap-y-1 text-sm tabular-nums",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"Gold 24K ",
					formatInr(market.goldInrPerGram24k, true),
					"/g",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [" · ", formatUsd(market.goldUsdPerGram)]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-subtle",
					children: [
						"22K ",
						formatInr(gold22, true),
						"/g"
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
					"BTC ",
					formatInr(market.btcInr),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-muted-foreground",
						children: [" · ", formatUsd(market.btcUsd)]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["USD ", formatInr(market.usdInr, true)] })
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs text-muted-foreground",
				children: [market.usedDemo ? "Indicative prices · " : "Live · ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					title: formatDateTime(market.asOf),
					children: relativeTime(market.asOf)
				})]
			}), onRefresh ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
				variant: "outline",
				size: "sm",
				onClick: onRefresh,
				disabled: refreshing,
				"aria-label": "Refresh prices",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RefreshCw, { className: refreshing ? "animate-spin" : void 0 }), "Refresh"]
			}) : null]
		})]
	});
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-muted", className),
		...props
	});
}
function Dashboard() {
	const { views, totals, market, history, hasHydrated } = usePortfolioView();
	const showUsd = usePortfolio((s) => s.showUsd);
	const refresh = useRefreshPrices();
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function onRefresh() {
		setBusy(true);
		try {
			const data = await refresh();
			toast.success(data.usedDemo ? "Using indicative prices" : "Prices updated");
		} catch {
			toast.error("Could not refresh. Showing last known prices.");
		} finally {
			setBusy(false);
		}
	}
	const top = [...views].sort((a, b) => b.currentValueInr - a.currentValueInr).slice(0, 5);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
				children: "Net worth"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-display text-3xl font-medium tracking-tight",
				children: "Treasury"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "text-right",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-subtle",
					children: "Unrealised P/L"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
					amount: totals.pnlInr,
					pct: totals.pnlPct,
					className: "text-sm"
				})]
			})]
		}), !hasHydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 md:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-40 rounded-xl" })
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PriceTicker, {
				market,
				refreshing: busy,
				onRefresh: () => void onRefresh()
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NetWorthCards, {
				totals,
				market,
				showUsd
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 lg:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AllocationChart, { views }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HistoryChart, { history })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, {
				className: "flex-row items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Largest holdings" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "ghost",
					size: "sm",
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/holdings",
						children: "View all"
					})
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col divide-y divide-border",
				children: [top.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/holdings/$holdingId",
					params: { holdingId: row.holding.id },
					className: "flex items-center justify-between gap-3 py-3 first:pt-0 last:pb-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm font-medium",
						children: row.holding.name
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted-foreground",
						children: typeShortLabel(row.holding.type)
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-right",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm tabular-nums",
							children: formatInr(row.currentValueInr)
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: formatPct(row.pnlPct)
						})]
					})]
				}, row.holding.id)), top.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "py-6 text-sm text-muted-foreground",
					children: [
						"No holdings yet.",
						" ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/holdings/new",
							className: "underline",
							children: "Add one"
						}),
						"."
					]
				}) : null]
			})] })
		] })]
	}) });
}
//#endregion
export { Dashboard as component };
