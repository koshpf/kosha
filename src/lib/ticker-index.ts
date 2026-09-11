import { searchLocalMfs } from "@/lib/mf-index";
import type { AssetType, Exchange } from "@/lib/types";

export type TickerHit = {
  ticker: string;
  name: string;
  exchange?: Exchange;
  detail?: string;
};

type Seed = {
  ticker: string;
  name: string;
  exchange: Exchange;
  kinds: Array<"indian_stock" | "us_stock" | "etf">;
};

const SEEDS: Seed[] = [
  { ticker: "RELIANCE", name: "Reliance Industries", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TCS", name: "Tata Consultancy Services", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "INFY", name: "Infosys", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "HDFCBANK", name: "HDFC Bank", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ICICIBANK", name: "ICICI Bank", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "SBIN", name: "State Bank of India", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "BHARTIARTL", name: "Bharti Airtel", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ITC", name: "ITC", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "HINDUNILVR", name: "Hindustan Unilever", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "LT", name: "Larsen & Toubro", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "AXISBANK", name: "Axis Bank", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "KOTAKBANK", name: "Kotak Mahindra Bank", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "BAJFINANCE", name: "Bajaj Finance", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ASIANPAINT", name: "Asian Paints", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "MARUTI", name: "Maruti Suzuki", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TITAN", name: "Titan Company", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "SUNPHARMA", name: "Sun Pharma", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "WIPRO", name: "Wipro", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "HCLTECH", name: "HCL Technologies", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TATAMOTORS", name: "Tata Motors", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TATASTEEL", name: "Tata Steel", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "NTPC", name: "NTPC", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "POWERGRID", name: "Power Grid", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ONGC", name: "ONGC", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "COALINDIA", name: "Coal India", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ADANIENT", name: "Adani Enterprises", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ADANIPORTS", name: "Adani Ports", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "M&M", name: "Mahindra & Mahindra", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "BAJAJFINSV", name: "Bajaj Finserv", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TECHM", name: "Tech Mahindra", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "CIPLA", name: "Cipla", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "DRREDDY", name: "Dr. Reddy's Laboratories", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "NESTLEIND", name: "Nestle India", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ULTRACEMCO", name: "UltraTech Cement", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "JIOFIN", name: "Jio Financial", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "BEL", name: "Bharat Electronics", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ZOMATO", name: "Eternal (Zomato)", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TRENT", name: "Trent", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "LICI", name: "Life Insurance Corporation", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "IRCTC", name: "IRCTC", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "IRFC", name: "IRFC", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "HDFCLIFE", name: "HDFC Life", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "SBILIFE", name: "SBI Life", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "BAJAJ-AUTO", name: "Bajaj Auto", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "HINDALCO", name: "Hindalco", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "JSWSTEEL", name: "JSW Steel", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "INDUSINDBK", name: "IndusInd Bank", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "GRASIM", name: "Grasim", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "DIVISLAB", name: "Divi's Laboratories", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "APOLLOHOSP", name: "Apollo Hospitals", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TATACONSUM", name: "Tata Consumer", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "BRITANNIA", name: "Britannia", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "EICHERMOT", name: "Eicher Motors", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "HEROMOTOCO", name: "Hero MotoCorp", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ADANIGREEN", name: "Adani Green", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "ADANIPOWER", name: "Adani Power", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "DMART", name: "Avenue Supermarts", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "PIDILITIND", name: "Pidilite", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "HAL", name: "Hindustan Aeronautics", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TVSMOTOR", name: "TVS Motor", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "DLF", name: "DLF", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "TATAPOWER", name: "Tata Power", exchange: "NSE", kinds: ["indian_stock"] },
  { ticker: "NIFTYBEES", name: "Nippon India Nifty 50 BeES", exchange: "NSE", kinds: ["etf"] },
  { ticker: "GOLDBEES", name: "Nippon India Gold BeES", exchange: "NSE", kinds: ["etf"] },
  { ticker: "BANKBEES", name: "Nippon India Bank BeES", exchange: "NSE", kinds: ["etf"] },
  { ticker: "ITBEES", name: "Nippon India IT BeES", exchange: "NSE", kinds: ["etf"] },
  { ticker: "JUNIORBEES", name: "Nippon India Junior BeES", exchange: "NSE", kinds: ["etf"] },
  { ticker: "SILVERBEES", name: "Nippon India Silver BeES", exchange: "NSE", kinds: ["etf"] },
  { ticker: "LIQUIDBEES", name: "Nippon India Liquid BeES", exchange: "NSE", kinds: ["etf"] },
  { ticker: "MON100", name: "Motilal Oswal Nasdaq 100 ETF", exchange: "NSE", kinds: ["etf"] },
  { ticker: "MOM100", name: "Motilal Oswal Midcap 100 ETF", exchange: "NSE", kinds: ["etf"] },
  { ticker: "MAFANG", name: "Mirae Asset NYSE FANG+ ETF", exchange: "NSE", kinds: ["etf"] },
  { ticker: "SETFNIF50", name: "SBI Nifty 50 ETF", exchange: "NSE", kinds: ["etf"] },
  { ticker: "CPSEETF", name: "CPSE ETF", exchange: "NSE", kinds: ["etf"] },
  { ticker: "ICICINIFTY", name: "ICICI Prudential Nifty 50 ETF", exchange: "NSE", kinds: ["etf"] },
  { ticker: "AAPL", name: "Apple", exchange: "US", kinds: ["us_stock"] },
  { ticker: "MSFT", name: "Microsoft", exchange: "US", kinds: ["us_stock"] },
  { ticker: "GOOGL", name: "Alphabet", exchange: "US", kinds: ["us_stock"] },
  { ticker: "AMZN", name: "Amazon", exchange: "US", kinds: ["us_stock"] },
  { ticker: "NVDA", name: "NVIDIA", exchange: "US", kinds: ["us_stock"] },
  { ticker: "META", name: "Meta Platforms", exchange: "US", kinds: ["us_stock"] },
  { ticker: "TSLA", name: "Tesla", exchange: "US", kinds: ["us_stock"] },
  { ticker: "BRK-B", name: "Berkshire Hathaway", exchange: "US", kinds: ["us_stock"] },
  { ticker: "JPM", name: "JPMorgan Chase", exchange: "US", kinds: ["us_stock"] },
  { ticker: "V", name: "Visa", exchange: "US", kinds: ["us_stock"] },
  { ticker: "UNH", name: "UnitedHealth", exchange: "US", kinds: ["us_stock"] },
  { ticker: "NFLX", name: "Netflix", exchange: "US", kinds: ["us_stock"] },
  { ticker: "AMD", name: "AMD", exchange: "US", kinds: ["us_stock"] },
  { ticker: "COST", name: "Costco", exchange: "US", kinds: ["us_stock"] },
  { ticker: "JNJ", name: "Johnson & Johnson", exchange: "US", kinds: ["us_stock"] },
  { ticker: "WMT", name: "Walmart", exchange: "US", kinds: ["us_stock"] },
  { ticker: "SPY", name: "SPDR S&P 500 ETF", exchange: "US", kinds: ["etf"] },
  { ticker: "QQQ", name: "Invesco QQQ", exchange: "US", kinds: ["etf"] },
  { ticker: "VOO", name: "Vanguard S&P 500 ETF", exchange: "US", kinds: ["etf"] },
  { ticker: "VTI", name: "Vanguard Total Stock Market", exchange: "US", kinds: ["etf"] },
  { ticker: "GLD", name: "SPDR Gold Shares", exchange: "US", kinds: ["etf"] },
];

function typeKind(type: AssetType): Seed["kinds"][number] | null {
  if (type === "indian_stock") return "indian_stock";
  if (type === "us_stock") return "us_stock";
  if (type === "etf") return "etf";
  return null;
}

export function searchLocalTickers(query: string, type: AssetType): TickerHit[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  if (type === "indian_mf") {
    return searchLocalMfs(query).map((row) => ({
      ticker: row.code,
      name: row.name,
      detail: row.code,
    }));
  }
  const wanted = typeKind(type);
  const scored = SEEDS.map((row) => {
    const ticker = row.ticker.toLowerCase();
    const name = row.name.toLowerCase();
    let score = 0;
    if (ticker === q) score = 100;
    else if (ticker.startsWith(q)) score = 80;
    else if (ticker.includes(q)) score = 50;
    else if (name.startsWith(q)) score = 40;
    else if (name.includes(q)) score = 20;
    if (score === 0) return { row, score: 0 };
    if (wanted && row.kinds.includes(wanted)) score += 8;
    return { row, score };
  })
    .filter((row) => row.score > 0)
    .sort((a, b) => b.score - a.score || a.row.ticker.localeCompare(b.row.ticker))
    .slice(0, 8);
  return scored.map(({ row }) => ({
    ticker: row.ticker,
    name: row.name,
    exchange: row.exchange,
    detail: row.kinds.includes("etf") ? `${row.exchange} · ETF` : row.exchange,
  }));
}
