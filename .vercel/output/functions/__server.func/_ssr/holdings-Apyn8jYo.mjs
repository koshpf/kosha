import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogOverlay, i as DialogDescription$1, n as DialogClose, o as DialogPortal, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as Search, l as Pencil, r as Trash2, t as X } from "../_libs/lucide-react.mjs";
import { E as ASSET_TYPES, O as typeShortLabel, S as usePortfolio, a as usePortfolioView, b as relativeTime, f as formatInr, h as formatQty, u as formatDateTime } from "./router-CUJh-yqh.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { i as cn, n as Button, t as AppShell } from "./button-2iqXmBEn.mjs";
import { t as PnlText } from "./pnl-BK4qfCGn.mjs";
import { t as Input } from "./input-BBVS02xX.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/holdings-Apyn8jYo.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", {
	variants: { variant: {
		default: "bg-muted text-muted-foreground",
		gain: "bg-gain/15 text-gain",
		loss: "bg-loss/15 text-loss",
		outline: "shadow-[var(--shadow-border)] text-muted-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var Dialog = Dialog$1;
function DialogContent({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-background/70" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
		className: cn("fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl bg-card p-5 text-card-foreground shadow-[var(--shadow-border)]", className),
		...props,
		children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
			className: "absolute top-3 right-3 rounded-md p-2 text-muted-foreground hover:bg-muted hover:text-foreground",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "sr-only",
				children: "Close"
			})]
		})]
	})] });
}
function DialogTitle({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
		className: cn("font-display text-lg font-medium", className),
		...props
	});
}
function DialogDescription({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
		className: cn("mt-1 text-sm text-muted-foreground", className),
		...props
	});
}
function HoldingsList({ views, onDelete }) {
	const [query, setQuery] = (0, import_react.useState)("");
	const [type, setType] = (0, import_react.useState)("all");
	const [sort, setSort] = (0, import_react.useState)("value");
	const [pendingDelete, setPendingDelete] = (0, import_react.useState)(null);
	const rows = (0, import_react.useMemo)(() => {
		const q = query.trim().toLowerCase();
		const filtered = views.filter((row) => {
			if (type !== "all" && row.holding.type !== type) return false;
			if (!q) return true;
			return `${row.holding.name} ${row.holding.ticker ?? ""} ${typeShortLabel(row.holding.type)}`.toLowerCase().includes(q);
		});
		filtered.sort((a, b) => {
			if (sort === "name") return a.holding.name.localeCompare(b.holding.name);
			if (sort === "type") return a.holding.type.localeCompare(b.holding.type);
			if (sort === "pnl") return b.pnlInr - a.pnlInr;
			return b.currentValueInr - a.currentValueInr;
		});
		return filtered;
	}, [
		views,
		query,
		type,
		sort
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex flex-col gap-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:flex-row md:items-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative flex-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search name or ticker",
						className: "pl-9"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NativeSort, {
					value: sort,
					onChange: setSort
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "-mx-4 overflow-x-auto px-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex min-w-max gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						active: type === "all",
						onClick: () => setType("all"),
						children: "All"
					}), ASSET_TYPES.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FilterChip, {
						active: type === item.id,
						onClick: () => setType(item.id),
						children: item.shortLabel
					}, item.id))]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "hidden overflow-hidden rounded-xl bg-card shadow-[var(--shadow-border)] md:block",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "text-left text-xs text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "border-b border-border",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Holding"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Qty"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Cost"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Value"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "P/L"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium",
									children: "Updated"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
									className: "px-4 py-3 font-medium sr-only",
									children: "Actions"
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b border-border last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
								className: "px-4 py-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-medium",
									children: row.holding.name
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xs text-muted-foreground",
									children: [typeShortLabel(row.holding.type), row.holding.ticker ? ` · ${row.holding.ticker}` : ""]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 tabular-nums",
								children: formatQty(row.holding.quantity)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 tabular-nums",
								children: formatInr(row.costBasisInr)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 tabular-nums font-medium",
								children: formatInr(row.currentValueInr)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
									amount: row.pnlInr,
									pct: row.pnlPct
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3 text-xs text-muted-foreground",
								title: formatDateTime(row.lastUpdated),
								children: relativeTime(row.lastUpdated)
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "px-4 py-3",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-end gap-1",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon-sm",
										asChild: true,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/holdings/$holdingId",
											params: { holdingId: row.holding.id },
											"aria-label": "Edit",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Pencil, {})
										})
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "ghost",
										size: "icon-sm",
										onClick: () => setPendingDelete(row),
										"aria-label": "Delete",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, {})
									})]
								})
							})
						]
					}, row.holding.id)) })]
				}), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "px-4 py-8 text-center text-sm text-muted-foreground",
					children: "No holdings match."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-3 md:hidden",
				children: [rows.map((row) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
					className: "rounded-xl bg-card p-4 shadow-[var(--shadow-border)]",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-start justify-between gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: row.holding.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									typeShortLabel(row.holding.type),
									" · ",
									formatQty(row.holding.quantity)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: formatInr(row.currentValueInr)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex items-center justify-between text-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PnlText, {
								amount: row.pnlInr,
								pct: row.pnlPct
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs text-subtle",
								children: relativeTime(row.lastUpdated)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-3 flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "outline",
								size: "sm",
								asChild: true,
								className: "flex-1",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/holdings/$holdingId",
									params: { holdingId: row.holding.id },
									children: "Edit"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								variant: "ghost",
								size: "sm",
								onClick: () => setPendingDelete(row),
								children: "Delete"
							})]
						})
					]
				}, row.holding.id)), rows.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-8 text-center text-sm text-muted-foreground",
					children: "No holdings match."
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!pendingDelete,
				onOpenChange: (open) => !open && setPendingDelete(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete holding" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogDescription, { children: [
						"Remove ",
						pendingDelete?.holding.name,
						"? This stays on this device only."
					] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 flex justify-end gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "outline",
							onClick: () => setPendingDelete(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "destructive",
							onClick: () => {
								if (pendingDelete) onDelete(pendingDelete.holding.id);
								setPendingDelete(null);
							},
							children: "Delete"
						})]
					})
				] })
			})
		]
	});
}
function FilterChip({ active, onClick, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		type: "button",
		onClick,
		className: cn("h-9 rounded-full px-3 text-xs font-medium transition-colors duration-150", active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"),
		children
	});
}
function NativeSort({ value, onChange }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
		value,
		onChange: (e) => onChange(e.target.value),
		className: "h-11 rounded-md border border-border bg-background px-3 text-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "value",
				children: "Sort by value"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "pnl",
				children: "Sort by P/L"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "name",
				children: "Sort by name"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
				value: "type",
				children: "Sort by type"
			})
		]
	});
}
function HoldingsPage() {
	const { views, hasHydrated } = usePortfolioView();
	const removeHolding = usePortfolio((s) => s.removeHolding);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6 flex items-end justify-between gap-3",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: "Portfolio"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium tracking-tight",
			children: "Holdings"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/holdings/new",
				children: "Add holding"
			})
		})]
	}), hasHydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldingsList, {
		views,
		onDelete: removeHolding
	}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading holdings…"
	})] });
}
//#endregion
export { HoldingsPage as component };
