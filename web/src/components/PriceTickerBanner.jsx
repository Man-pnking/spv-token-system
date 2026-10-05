import { useSPVFees } from "../hooks/useSPVFees";
import { useRecentActivity } from "../hooks/useRecentActivity";
import { formatSpv } from "../utils/format";

export default function PriceTickerBanner({ visible }) {
  const fees = useSPVFees();
  const { activities } = useRecentActivity();

  const price = fees.loading ? "—" : Number(fees.priceDisplay).toFixed(6);
  const changePct = fees.loading
    ? "—"
    : ((fees.priceRatio - 1) * 100).toFixed(2);
  const changePositive = !fees.loading && fees.priceRatio >= 1;

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
        <span className="text-warm-mute">({fees.triggersMet}/2 triggers)</span>
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
      className="overflow-hidden transition-all duration-500 ease-out"
      style={{
        maxHeight: visible ? "56px" : "0px",
        opacity: visible ? 1 : 0,
        marginTop: visible ? "8px" : "0px",
        transform: visible ? "translateY(0)" : "translateY(-8px)",
        pointerEvents: visible ? "auto" : "none",
      }}
      aria-hidden={!visible}
    >
      <div
        className="rounded-2xl py-2.5 flex items-center h-12"
        style={{
          background: "rgba(15, 11, 7, 0.5)",
          backdropFilter: "blur(40px) saturate(140%)",
          WebkitBackdropFilter: "blur(40px) saturate(140%)",
          border: "1px solid rgba(0, 255, 255, 0.06)",
        }}
      >
        <div className="ticker-track flex items-center min-w-max">
          {row}
          {row}
          {row}
        </div>
      </div>
      <style>{`
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-33.333%); }
        }
        .ticker-track {
          animation: tickerScroll 60s linear infinite;
        }
        .ticker-track:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}