export type UlipFund = {
  code: string;
  name: string;
  insurer: string;
  path: string;
};

/** Popular ULIP funds with Moneycontrol pages for live NAV. */
export const ULIP_FUNDS: UlipFund[] = [
  { code: "ITA267", insurer: "Tata AIA Smart SIP", name: "Momentum 50 Index Fund (MFI)", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-momentum-50-index-fund--ITA267.html" },
  { code: "ITA264", insurer: "Tata AIA Smart SIP", name: "Multicap Momentum Quality Index Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-multicap-momentum-quality-index-fund--ITA264.html" },
  { code: "ITA263", insurer: "Tata AIA Smart SIP", name: "Nifty Alpha 50 Index Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-nifty-alpha-50-index-fund--ITA263.html" },
  { code: "ITA266", insurer: "Tata AIA Smart SIP", name: "Top 200 Alpha 30 Index Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-top-200-alpha-30-index-fund--ITA266.html" },
  { code: "ITA268", insurer: "Tata AIA Smart SIP", name: "Sector Leaders Index Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-sector-leaders-index-fund--ITA268.html" },
  { code: "ITA252", insurer: "Tata AIA Smart SIP", name: "Top 50 Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-top-50-fund--ITA252.html" },
  { code: "ITA253", insurer: "Tata AIA Smart SIP", name: "Top 200 Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-top-200-fund--ITA253.html" },
  { code: "ITA250", insurer: "Tata AIA Smart SIP", name: "Multi Cap Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-multi-cap-fund--ITA250.html" },
  { code: "ITA256", insurer: "Tata AIA Smart SIP", name: "Whole Life Mid Cap Equity Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-whole-life-mid-cap-equity-fund--ITA256.html" },
  { code: "ITA259", insurer: "Tata AIA Smart SIP", name: "Small Cap Discovery Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-small-cap-discovery-fund--ITA259.html" },
  { code: "ITA248", insurer: "Tata AIA Smart SIP", name: "Emerging Opportunities Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-emerging-opportunities-fund-ITA248.html" },
  { code: "ITA254", insurer: "Tata AIA Smart SIP", name: "Super Select Equity Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-super-select-equity-fund--ITA254.html" },
  { code: "ITA255", insurer: "Tata AIA Smart SIP", name: "Large Cap Equity Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-large-cap-equity-fund--ITA255.html" },
  { code: "ITA258", insurer: "Tata AIA Smart SIP", name: "Flexi Growth Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-flexi-growth-fund--ITA258.html" },
  { code: "ITA269", insurer: "Tata AIA Smart SIP", name: "Multicap Opportunities Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-multicap-opportunities-fund--ITA269.html" },
  { code: "ITA262", insurer: "Tata AIA Smart SIP", name: "Rising India Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-rising-india-fund--ITA262.html" },
  { code: "ITA251", insurer: "Tata AIA Smart SIP", name: "India Consumption Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-india-consumption-fund--ITA251.html" },
  { code: "ITA257", insurer: "Tata AIA Smart SIP", name: "Dynamic Advantage Fund", path: "tata-aia-life-insurance-TA/tata-aia-smart-sip-ulip-plan-dynamic-advantage-fund--ITA257.html" },
  { code: "ITA065", insurer: "Tata AIA", name: "Tata AIA Individual Life - Equity", path: "tata-aia-life-insurance-TA/tata-aia-individual-life-equity-ITA065.html" },
  { code: "ITA064", insurer: "Tata AIA", name: "Tata AIA Individual Life - Balanced", path: "tata-aia-life-insurance-TA/tata-aia-individual-life-balanced-ITA064.html" },
  { code: "ITA063", insurer: "Tata AIA", name: "Tata AIA Individual Life - Aggressive Growth", path: "tata-aia-life-insurance-TA/tata-aia-individual-life-aggressive-growth-ITA063.html" },
  { code: "ITA066", insurer: "Tata AIA", name: "Tata AIA Individual Life - Growth", path: "tata-aia-life-insurance-TA/tata-aia-individual-life-growth-ITA066.html" },
  { code: "ITA070", insurer: "Tata AIA", name: "Tata AIA Individual Life - Stable Growth", path: "tata-aia-life-insurance-TA/tata-aia-individual-life-stable-growth-ITA070.html" },
  { code: "ITA235", insurer: "Tata AIA", name: "Tata AIA Emerging Opportunities Fund", path: "tata-aia-life-insurance-TA/tata-aia-emerging-opportunities-fund--ITA235.html" },
  { code: "ITA246", insurer: "Tata AIA", name: "Tata AIA Midcap Momentum Index Fund", path: "tata-aia-life-insurance-TA/tata-aia-midcap-momentum-index-fund-ITA246.html" },
  { code: "ITA270", insurer: "Tata AIA", name: "Tata AIA Multifactor Index Fund", path: "tata-aia-life-insurance-TA/tata-aia-multifactor-index-fund-ITA270.html" },
  { code: "IHD506", insurer: "HDFC Life", name: "HDFC Life Click 2 Wealth - Opportunities", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-wealth-opportunities-fund-IHD506.html" },
  { code: "IHD501", insurer: "HDFC Life", name: "HDFC Life Click 2 Wealth - Blue Chip", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-wealth-blue-chip-fund-IHD501.html" },
  { code: "IHD500", insurer: "HDFC Life", name: "HDFC Life Click 2 Wealth - Diversified Equity", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-wealth-diversified-equity-fund-IHD500.html" },
  { code: "IHD504", insurer: "HDFC Life", name: "HDFC Life Click 2 Wealth - Discovery", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-wealth-discovery-fund-IHD504.html" },
  { code: "IHD572", insurer: "HDFC Life", name: "HDFC Life Click 2 Wealth - Flexi Cap", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-wealth-flexi-cap-IHD572.html" },
  { code: "IHD457", insurer: "HDFC Life", name: "HDFC Life Click 2 Invest - Blue Chip", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-invest-blue-chip-fund-IHD457.html" },
  { code: "IHD454", insurer: "HDFC Life", name: "HDFC Life Click 2 Invest - Diversified Equity", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-invest-diversified-equity-fund-IHD454.html" },
  { code: "IHD453", insurer: "HDFC Life", name: "HDFC Life Click 2 Invest - Equity Plus", path: "hdfc-standard-life-insurance-HD/hdfc-life-click-2-invest-equity-plus-fund-IHD453.html" },
  { code: "IIP490", insurer: "ICICI Prudential", name: "ICICI Pru ACE Bluechip Fund", path: "icici-prudential-life-insurance-IP/icici-pru-ace-bluechip-fund-IIP490.html" },
  { code: "IIP491", insurer: "ICICI Prudential", name: "ICICI Pru ACE Multi Cap Growth Fund", path: "icici-prudential-life-insurance-IP/icici-pru-ace-multi-cap-growth-fund-IIP491.html" },
  { code: "IIP496", insurer: "ICICI Prudential", name: "ICICI Pru ACE Opportunities Fund", path: "icici-prudential-life-insurance-IP/icici-pru-ace-oppurtunities-fund-IIP496.html" },
  { code: "ISB046", insurer: "SBI Life", name: "SBI Life Unit Plus Elite - Equity Elite", path: "sbi-life-insurance-SB/sbi-life-unit-plus-elite-equity-elite-fund-ISB046.html" },
  { code: "ISB048", insurer: "SBI Life", name: "SBI Life Unit Plus Elite - Growth", path: "sbi-life-insurance-SB/sbi-life-unit-plus-elite-growth-fund-ISB048.html" },
  { code: "ISB047", insurer: "SBI Life", name: "SBI Life Unit Plus Elite - Balanced", path: "sbi-life-insurance-SB/sbi-life-unit-plus-elite-balanced-fund-ISB047.html" },
];

export const ULIP_INSURERS = [...new Set(ULIP_FUNDS.map((row) => row.insurer))];

const BY_CODE = new Map(ULIP_FUNDS.map((row) => [row.code, row]));

export function ulipByCode(code: string | undefined): UlipFund | undefined {
  if (!code) return undefined;
  return BY_CODE.get(code.trim().toUpperCase());
}

export function ulipQuoteKey(code: string): string {
  return `ULIP:${code.trim().toUpperCase()}`;
}
