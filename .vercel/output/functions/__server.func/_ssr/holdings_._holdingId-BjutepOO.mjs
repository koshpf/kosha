import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { S as usePortfolio, r as Route$1 } from "./router-CUJh-yqh.mjs";
import { t as AppShell } from "./button-2iqXmBEn.mjs";
import { t as HoldingForm } from "./holding-form-D78hAtL8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/holdings_._holdingId-BjutepOO.js
var import_jsx_runtime = require_jsx_runtime();
function EditHoldingPage() {
	const { holdingId } = Route$1.useParams();
	const holding = usePortfolio((s) => s.holdings.find((row) => row.id === holdingId));
	const hasHydrated = usePortfolio((s) => s.hasHydrated);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: "Portfolio"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium tracking-tight",
			children: "Edit holding"
		})]
	}), !hasHydrated ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
		className: "text-sm text-muted-foreground",
		children: "Loading…"
	}) : holding ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldingForm, { existing: holding }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
		className: "text-sm text-muted-foreground",
		children: [
			"Holding not found.",
			" ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/holdings",
				className: "underline",
				children: "Back to list"
			})
		]
	})] });
}
//#endregion
export { EditHoldingPage as component };
