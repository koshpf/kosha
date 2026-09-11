import { useEffect, useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui/input";
import { searchMutualFunds, searchTickers, warmupMutualFunds } from "@/lib/quotes";
import { searchLocalTickers, type TickerHit } from "@/lib/ticker-index";
import type { AssetType } from "@/lib/types";

export function TickerSearch({
  type,
  value,
  onChange,
  onPick,
  onAutoName,
  autoFocus,
}: {
  type: AssetType;
  value: string;
  onChange: (ticker: string) => void;
  onPick: (hit: TickerHit) => void;
  onAutoName: (name: string) => void;
  autoFocus?: boolean;
}) {
  const isMf = type === "indian_mf";
  const query = value.trim();
  const localHits = useMemo(
    () => (query.length < 1 ? [] : searchLocalTickers(query, type)),
    [query, type],
  );
  const [remoteHits, setRemoteHits] = useState<TickerHit[]>([]);
  const [lookingUp, setLookingUp] = useState(false);
  const [picked, setPicked] = useState(false);
  const seq = useRef(0);
  const onAutoNameRef = useRef(onAutoName);
  onAutoNameRef.current = onAutoName;

  const hits = useMemo(() => mergeHits(localHits, remoteHits), [localHits, remoteHits]);

  useEffect(() => {
    if (!isMf) return;
    void warmupMutualFunds().catch(() => undefined);
  }, [isMf]);

  useEffect(() => {
    const q = query.toLowerCase();
    if (!q || isMf) return;
    const exact = localHits.find((hit) => hit.ticker.toLowerCase() === q);
    const prefix = localHits.filter((hit) => hit.ticker.toLowerCase().startsWith(q));
    const pick = exact ?? (prefix.length === 1 ? prefix[0] : undefined);
    if (pick?.name) onAutoNameRef.current(pick.name);
  }, [query, isMf, localHits]);

  useEffect(() => {
    if (picked) {
      setRemoteHits([]);
      setLookingUp(false);
      return;
    }
    setRemoteHits([]);
    if (query.length < 2) {
      setLookingUp(false);
      return;
    }
    if (!isMf && localHits.length > 0 && query.length < 4) {
      setLookingUp(false);
      return;
    }

    const id = ++seq.current;
    setLookingUp(localHits.length === 0);
    const timer = window.setTimeout(() => {
      const remotePromise: Promise<TickerHit[]> = isMf
        ? searchMutualFunds({ data: { query } })
            .then((rows) =>
              rows.map((row) => ({
                ticker: String(row.schemeCode),
                name: row.schemeName,
                detail: String(row.schemeCode),
              })),
            )
            .catch(() => [] as TickerHit[])
        : searchTickers({ data: { query, type } }).catch(() => [] as TickerHit[]);

      void Promise.race([
        remotePromise,
        new Promise<TickerHit[]>((resolve) => {
          window.setTimeout(() => resolve([]), isMf ? 10000 : 4000);
        }),
      ]).then((remote) => {
        if (seq.current !== id) return;
        setRemoteHits(remote);
        if (remote.length === 1 && remote[0]?.name) onAutoNameRef.current(remote[0].name);
        setLookingUp(false);
      });
    }, 280);

    return () => {
      window.clearTimeout(timer);
      seq.current += 1;
    };
  }, [query, type, isMf, localHits.length, picked]);

  function pick(hit: TickerHit) {
    setPicked(true);
    setRemoteHits([]);
    setLookingUp(false);
    onPick(hit);
  }

  return (
    <div className="relative">
      <Input
        value={value}
        autoFocus={autoFocus}
        autoComplete="off"
        autoCorrect="off"
        spellCheck={false}
        enterKeyHint="search"
        onChange={(e) => {
          const raw = e.target.value;
          setPicked(false);
          onChange(isMf ? raw : raw.toUpperCase().replace(/\s+/g, ""));
        }}
        onKeyDown={(e) => {
          if (e.key === "Enter" && hits[0]) {
            e.preventDefault();
            pick(hits[0]);
          }
        }}
        placeholder={isMf ? "HDFC LargeMidcap 250 or 152889" : "MON100, RELIANCE, AAPL"}
      />
      {lookingUp && hits.length === 0 && !picked ? (
        <p className="mt-1 text-xs text-muted-foreground">Looking up ticker…</p>
      ) : null}
      {!picked && hits.length > 0 ? (
        <ul className="absolute z-50 mt-1 max-h-56 w-full overflow-y-auto rounded-md border border-border bg-card py-1 shadow-[var(--shadow-border)]">
          {hits.map((hit) => (
            <li key={`${hit.ticker}-${hit.exchange ?? hit.detail ?? ""}`}>
              <button
                type="button"
                className="flex min-h-11 w-full touch-manipulation flex-col justify-center px-3 py-2 text-left text-sm hover:bg-muted"
                onPointerDown={(e) => {
                  e.preventDefault();
                  pick(hit);
                }}
              >
                <span className="font-medium">{isMf ? hit.name : hit.ticker}</span>
                <span className="text-xs text-muted-foreground">
                  {isMf ? hit.ticker : [hit.name, hit.detail].filter(Boolean).join(" · ")}
                </span>
              </button>
            </li>
          ))}
        </ul>
      ) : query.length >= 2 && !lookingUp && !picked ? (
        <p className="mt-1 text-xs text-muted-foreground">No match yet — you can still type the name below.</p>
      ) : null}
    </div>
  );
}

function mergeHits(local: TickerHit[], remote: TickerHit[]): TickerHit[] {
  const out: TickerHit[] = [];
  const seen = new Set<string>();
  for (const hit of [...local, ...remote]) {
    const key = `${hit.ticker}|${hit.exchange ?? ""}`;
    if (seen.has(key)) continue;
    seen.add(key);
    out.push(hit);
    if (out.length >= 8) break;
  }
  return out;
}
