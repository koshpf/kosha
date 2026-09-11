import { i as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as downloadBackup, S as usePortfolio, T as serializeBackup, u as formatDateTime, w as parseVault, x as applyTheme } from "./router-CUJh-yqh.mjs";
import { i as cn, n as Button, s as useRefreshPrices, t as AppShell } from "./button-2iqXmBEn.mjs";
import { a as CardTitle, i as CardHeader, n as CardContent, r as CardDescription, t as Card } from "./card-C_4TSInD.mjs";
import { n as SwitchThumb, t as Switch$1 } from "../_libs/radix-ui__react-switch.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-9_kv9DT5.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Switch({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch$1, {
		className: cn("peer inline-flex h-6 w-10 shrink-0 items-center rounded-full bg-muted transition-colors duration-150 data-[state=checked]:bg-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SwitchThumb, { className: "pointer-events-none block size-5 translate-x-0.5 rounded-full bg-background transition-transform duration-150 data-[state=checked]:translate-x-[18px] data-[state=checked]:bg-primary-foreground" })
	});
}
function SettingsPage() {
	const theme = usePortfolio((s) => s.theme);
	const showUsd = usePortfolio((s) => s.showUsd);
	const setTheme = usePortfolio((s) => s.setTheme);
	const setShowUsd = usePortfolio((s) => s.setShowUsd);
	const lastPrices = usePortfolio((s) => s.lastPrices);
	const holdings = usePortfolio((s) => s.holdings);
	const snapshot = usePortfolio((s) => s.snapshot);
	const importVault = usePortfolio((s) => s.importVault);
	const refresh = useRefreshPrices();
	const [busy, setBusy] = (0, import_react.useState)(false);
	const fileRef = (0, import_react.useRef)(null);
	function onExport() {
		downloadBackup(serializeBackup(snapshot()));
		toast.success("Backup downloaded");
	}
	async function onCopy() {
		try {
			await navigator.clipboard.writeText(serializeBackup(snapshot()));
			toast.success("Backup copied. Save it in your notes or a password manager.");
		} catch {
			toast.error("Could not copy. Download the file instead.");
		}
	}
	function onImportFile(file) {
		const reader = new FileReader();
		reader.onload = () => {
			try {
				const payload = parseVault(String(reader.result ?? ""));
				importVault(payload);
				applyTheme(payload.theme);
				toast.success(`Restored ${payload.holdings.length} holdings`);
			} catch {
				toast.error("That file is not a Kosha backup.");
			}
		};
		reader.readAsText(file);
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: "Preferences"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium tracking-tight",
			children: "Settings"
		})]
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex max-w-xl flex-col gap-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Your vault" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Holdings live on this device only — no account, nothing uploaded. Export a backup so you can reopen Kosha on another phone or after a reset." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							holdings.length,
							" holding",
							holdings.length === 1 ? "" : "s",
							" saved here"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col gap-2 sm:flex-row",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							onClick: onExport,
							className: "sm:flex-1",
							children: "Download backup"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "button",
							variant: "outline",
							onClick: () => void onCopy(),
							className: "sm:flex-1",
							children: "Copy backup"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileRef,
						type: "file",
						accept: "application/json,.json",
						className: "hidden",
						onChange: (e) => {
							const file = e.target.files?.[0];
							e.target.value = "";
							if (file) onImportFile(file);
						}
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "button",
						variant: "outline",
						onClick: () => fileRef.current?.click(),
						children: "Restore from file"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Appearance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Dark is the default. Light keeps the same ledger layout." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Light mode"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Off = dark treasury"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: theme === "light",
					onCheckedChange: (checked) => {
						const next = checked ? "light" : "dark";
						setTheme(next);
						applyTheme(next);
					},
					"aria-label": "Light mode"
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Currency display" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Net worth is always in ₹. USD is a companion figure." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex items-center justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm font-medium",
					children: "Show USD under rupees"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs text-muted-foreground",
					children: "Uses the live USD/INR rate"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Switch, {
					checked: showUsd,
					onCheckedChange: setShowUsd,
					"aria-label": "Show USD"
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Prices" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardDescription, { children: "Indian stocks and funds in ₹, US names in $ and ₹, gold per gram, bitcoin in ₹ and $." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: lastPrices ? `Last refresh ${formatDateTime(lastPrices.asOf)}${lastPrices.usedDemo ? " · indicative" : ""}` : "Prices load on first visit"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					onClick: async () => {
						setBusy(true);
						try {
							const data = await refresh();
							toast.success(data.usedDemo ? "Using indicative prices" : "Prices updated");
						} catch {
							toast.error("Refresh failed");
						} finally {
							setBusy(false);
						}
					},
					disabled: busy,
					children: "Refresh prices"
				})]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "px-1 text-xs text-subtle",
				children: "This is local-first: your ledger stays on the phone. A backup file is the portable copy — not a login. Figures are for personal tracking, not investment advice."
			})
		]
	})] });
}
//#endregion
export { SettingsPage as component };
