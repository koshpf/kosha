import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { g as formatSignedInr, m as formatPct, y as pnlTone } from "./router-CUJh-yqh.mjs";
import { i as cn } from "./button-2iqXmBEn.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/pnl-BK4qfCGn.js
var import_jsx_runtime = require_jsx_runtime();
function PnlText({ amount, pct, className }) {
	const tone = pnlTone(amount);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("tabular-nums", tone === "gain" && "text-gain", tone === "loss" && "text-loss", tone === "flat" && "text-muted-foreground", className),
		children: [formatSignedInr(amount), pct != null ? ` (${formatPct(pct)})` : null]
	});
}
//#endregion
export { PnlText as t };
