import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as Route } from "./router-CUJh-yqh.mjs";
import { t as AppShell } from "./button-2iqXmBEn.mjs";
import { n as TypePicker, t as HoldingForm } from "./holding-form-D78hAtL8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/holdings_.new-DjPAz1nk.js
var import_jsx_runtime = require_jsx_runtime();
function NewHoldingPage() {
	const { type } = Route.useSearch();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AppShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mb-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-xs font-medium tracking-wide text-muted-foreground uppercase",
			children: "Portfolio"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl font-medium tracking-tight",
			children: "Add holding"
		})]
	}), type ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HoldingForm, { initialType: type }, type) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TypePicker, {})] });
}
//#endregion
export { NewHoldingPage as component };
