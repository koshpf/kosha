export type MfRow = { code: string; name: string };

/** Popular schemes so typing works even if the live list is slow. */
export const MF_SEEDS: MfRow[] = [
  { code: "152889", name: "HDFC NIFTY LargeMidcap 250 Index Fund - Direct Plan - Growth" },
  { code: "152890", name: "HDFC NIFTY LargeMidcap 250 Index Fund - Regular Plan - Growth" },
  { code: "152482", name: "ICICI Prudential Nifty LargeMidcap 250 Index Fund - Direct Plan - Growth" },
  { code: "152481", name: "ICICI Prudential Nifty LargeMidcap 250 Index Fund - Regular Plan - Growth" },
  { code: "152156", name: "Zerodha Nifty LargeMidcap 250 Index Fund - Direct Plan - Growth" },
  { code: "152976", name: "Mirae Asset Nifty LargeMidcap 250 Index Fund - Direct Plan - Growth" },
  { code: "149343", name: "Edelweiss NIFTY Large Midcap 250 Index Fund - Direct Plan - Growth" },
  { code: "122639", name: "Parag Parikh Flexi Cap Fund Direct Growth" },
  { code: "122640", name: "Parag Parikh Flexi Cap Fund Regular Growth" },
  { code: "120503", name: "HDFC Flexi Cap Fund Direct Growth" },
  { code: "101762", name: "HDFC Flexi Cap Fund Growth" },
  { code: "118989", name: "HDFC Mid-Cap Opportunities Fund Direct Growth" },
  { code: "105758", name: "HDFC Mid-Cap Opportunities Fund Growth" },
  { code: "119060", name: "HDFC Balanced Advantage Fund Direct Growth" },
  { code: "118955", name: "Nippon India Small Cap Fund Direct Growth" },
  { code: "147946", name: "BANDHAN Small Cap Fund - Direct Plan - Growth" },
  { code: "147944", name: "BANDHAN Small Cap Fund - Regular Plan - Growth" },
  { code: "147943", name: "BANDHAN Small Cap Fund - Direct Plan - IDCW" },
  { code: "152264", name: "BANDHAN Nifty Smallcap 250 Index Fund - Direct Plan - Growth" },
  { code: "125497", name: "SBI Small Cap Fund Direct Growth" },
  { code: "120716", name: "UTI Nifty 50 Index Fund Direct Growth" },
  { code: "120674", name: "Motilal Oswal Midcap Fund Direct Growth" },
  { code: "120505", name: "ICICI Prudential Bluechip Fund Direct Growth" },
  { code: "120323", name: "Mirae Asset Large Cap Fund Direct Growth" },
  { code: "119551", name: "Quant Small Cap Fund Direct Growth" },
  { code: "120465", name: "Axis ELSS Tax Saver Fund Direct Growth" },
  { code: "118778", name: "Kotak Emerging Equity Fund Direct Growth" },
  { code: "118955", name: "Nippon India Small Cap Fund Direct Growth" },
  { code: "119766", name: "Nippon India Growth Fund Direct Growth" },
  { code: "125354", name: "Canara Robeco Small Cap Fund Direct Growth" },
  { code: "120578", name: "SBI Magnum Midcap Fund Direct Growth" },
  { code: "119598", name: "Tata Digital India Fund Direct Growth" },
];

const STOP = new Set(["and", "the", "fund", "plan", "option", "of", "or", "in"]);

const ALIASES: Record<string, string[]> = {
  idfc: ["bandhan"],
  bandhan: ["idfc"],
  ppfas: ["parag", "parikh"],
  nippon: ["reliance"],
};

function expandToken(token: string): string[] {
  return [token, ...(ALIASES[token] ?? [])];
}

function compactText(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, "");
}

function tokensOf(value: string) {
  return value
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter((token) => token.length >= 2 && !STOP.has(token));
}

export function rankMutualFunds(rows: MfRow[], query: string, limit = 10): MfRow[] {
  const q = query.trim().toLowerCase();
  if (q.length < 2) return [];
  const qCompact = compactText(q);
  const tokens = tokensOf(q);
  const scored: Array<{ row: MfRow; score: number }> = [];

  for (const row of rows) {
    const name = row.name.toLowerCase();
    const compact = compactText(row.name);
    let score = 0;
    if (row.code === q || row.code.startsWith(q)) score += 130;
    if (qCompact.length >= 6 && compact.includes(qCompact)) score += 90;
    const tokenHits = tokens.filter((token) =>
      expandToken(token).some((alias) => compact.includes(alias)),
    ).length;
    if (tokens.length && tokenHits === tokens.length) score += 70;
    else if (tokenHits >= Math.min(2, tokens.length) && tokenHits / Math.max(tokens.length, 1) >= 0.6) {
      score += 45;
    } else if (name.includes(q)) score += 35;
    else if (tokenHits === 0 && !score) continue;
    else if (tokenHits === 1 && tokens.length > 2 && !score) continue;

    if (/direct/.test(name)) score += 8;
    if (/growth/.test(name) && !/idcw|dividend/.test(name)) score += 6;
    if (/\bfmp\b/.test(name) && !/\bfmp\b/.test(q)) score -= 50;
    if (!/index|nifty|etf/.test(q) && /index|\betf\b/.test(name)) score -= 20;
    if (/small\s*cap/.test(q) && /small cap fund/.test(name)) score += 22;
    if (score > 0) scored.push({ row, score });
  }

  scored.sort((a, b) => b.score - a.score || a.row.name.localeCompare(b.row.name));
  const seen = new Set<string>();
  const out: MfRow[] = [];
  for (const item of scored) {
    if (seen.has(item.row.code)) continue;
    seen.add(item.row.code);
    out.push(item.row);
    if (out.length >= limit) break;
  }
  return out;
}

export function searchLocalMfs(query: string): MfRow[] {
  return rankMutualFunds(MF_SEEDS, query, 8);
}
