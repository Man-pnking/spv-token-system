import { useSPVFees } from "../hooks/useSPVFees";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { formatSpv } from "../utils/format";

export default function PriceTickerBanner() {
  const fees = useSPVFees();
  const { activities } = useRecentActivity();

  const price = fees.loading ? "—" : Number(fees.priceDisplay).toFixed(6);

  // Guard against bad ratios — if something upstream breaks, show 0.00% rather than garbage
  const safeRatio = Number(fees.priceRatio);
  const validRatio = Number.isFinite(safeRatio) && safeRatio > 0 && safeRatio < 100;
  const changePct = fees.loading || !validRatio
    ? "0.00"
    : ((safeRatio - 1) * 100).toFixed(2);
  const changePositive = validRatio && safeRatio >= 1;

  const items = [];

  items.push({
    key: "price",
    node: (
      <>
        <span className="text-warm-mute">SPV/USDT</span>
        <span className="text-warm font-mono">{price}</span>
        <span className={changePositive ? "text-green-400" : "text-red-400"}>
          {changePositive ? "▲" : "▼"} {changePct}%
        </span>
      </>
    ),
  });

  items.push({
    key: "migration",
    node: (
      <>
        <span className="text-warm-mute">Migration</span>
        <span className="text-warm font-mono">
          {fees.loading ? "—" : `${fees.progress.toFixed(1)}%`}
        </span>
        <span className="text-warm-mute">({fees.triggersMet}/2)</span>
      </>
    ),
  });

  items.push({
    key: "minted",
    node: (
      <>
        <span className="text-warm-mute">Minted</span>
        <span className="text-warm font-mono">{formatSpv(fees.totalMinted)}</span>
        <span className="text-warm-mute">SPV</span>
      </>
    ),
  });

  items.push({
    key: "holders",
    node: (
      <>
        <span className="text-warm-mute">Holders</span>
        <span className="text-warm font-mono">{fees.uniqueBuyers}</span>
      </>
    ),
  });

  if (activities && activities.length > 0) {
    activities.slice(0, 5).forEach((a, i) => {
      const isBuy = a.type === "buy";
      items.push({
        key: `trade-${i}`,
        node: (
          <>
            <span className={isBuy ? "text-green-400" : "text-red-400"}>
              {isBuy ? "BUY" : "SELL"}
            </span>
            <span className="text-warm font-mono">
              {a.amountDisplay || a.amount}
            </span>
            {a.addressShort && (
              <span className="text-warm-mute truncate">{a.addressShort}</span>
            )}
          </>
        ),
      });
    });
  }

  const row = (
    <>
      {items.map((item, i) => (
        <span
          key={`${item.key}-${i}`}
          className="inline-flex items-center gap-2 px-5 text-[11px] sm:text-xs whitespace-nowrap"
        >
          {item.node}
          <span className="text-[#00ffff]/30 ml-5">·</span>
        </span>
      ))}
    </>
  );

  return (
    <div
      className="w-full overflow-hidden"
      style={{
        background: "rgba(10, 8, 6, 0.92)",
        borderBottom: "1px solid rgba(0, 255, 255, 0.08)",
        contain: "layout paint",
      }}
    >
      <div className="flex items-center h-8">
        <div
          className="ticker-track flex items-center min-w-max"
          style={{ willChange: "transform" }}
        >
          {row}
          {row}
          {row}
        </div>
      </div>
      <style>{`
        @keyframes tickerScroll {
          from { transform: translate3d(0, 0, 0); }
          to   { transform: translate3d(-33.333%, 0, 0); }
        }
        .ticker-track {
          animation: tickerScroll 60s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .ticker-track { animation: none; }
        }
      `}</style>
    </div>
  );
}