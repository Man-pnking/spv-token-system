import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { useTradeHistory } from "../hooks/useTradeHistory";
import { useSPVFees } from "../hooks/useSPVFees";
import AnimatedNumber from "./AnimatedNumber";

function CustomTooltip({ active, payload }) {
  if (!active || !payload || !payload.length) return null;
  const p = payload[0].payload;
  return (
    <div
      className="rounded-xl px-3 py-2 text-xs"
      style={{
        background: "rgba(15, 11, 7, 0.9)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(212, 175, 55, 0.15)",
      }}
    >
      <div className="text-warm-mute uppercase tracking-wider text-[10px] mb-1">
        {p.type === "buy" ? "Buy" : p.type === "sell" ? "Sell" : "Start"}
      </div>
      <div className="text-mono text-warm">
        {p.price.toFixed(6)} USDT
      </div>
      {p.usdt > 0 && (
        <div className="text-mono text-warm-mute text-[10px] mt-1">
          {p.usdt.toFixed(4)} USDT · {p.tokens.toFixed(2)} SPV
        </div>
      )}
    </div>
  );
}

export default function PriceChart() {
  const { data, loading, error } = useTradeHistory();
  const fees = useSPVFees();

  const initialPrice = 0.01;
  const currentPrice = fees.loading ? null : Number(fees.priceDisplay);
  const hasData = data && data.length > 0;

  const series = hasData
    ? [{ index: -1, price: initialPrice, block: 0, type: "init", usdt: 0, tokens: 0 }, ...data]
    : [];

  const prices = series.map((d) => d.price).filter((p) => p > 0);
  const minPrice = prices.length ? Math.min(...prices) : 0.009;
  const maxPrice = prices.length ? Math.max(...prices) : 0.011;
  const pad = (maxPrice - minPrice) * 0.15 || 0.001;
  const domainMin = Math.max(0, minPrice - pad);
  const domainMax = maxPrice + pad;

  return (
    <div className="mb-16">
      <div className="flex items-baseline justify-between mb-4">
        <div className="text-label">Price history</div>
        <div className="flex items-baseline gap-6 text-[10px] uppercase tracking-[0.25em] text-warm-mute">
          <span>Start {initialPrice.toFixed(6)}</span>
          <span className="text-[#d4af37]">
            {currentPrice ? (
              <>
                Now <AnimatedNumber value={currentPrice} decimals={6} />
              </>
            ) : (
              "—"
            )}
          </span>
        </div>
      </div>

      <div className="h-48 w-full">
        {loading && (
          <div className="h-full flex items-center justify-center text-warm-mute text-xs">
            Loading trades…
          </div>
        )}

        {!loading && error && (
          <div className="h-full flex items-center justify-center text-warm-mute text-xs">
            Chart unavailable — {error}
          </div>
        )}

        {!loading && !error && !hasData && (
          <div className="h-full flex items-center justify-center text-warm-mute text-xs">
            No trades yet. The first buy will appear here.
          </div>
        )}

        {!loading && !error && hasData && (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={series} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
              <defs>
                <linearGradient id="goldStroke" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="rgba(184, 134, 11, 0.7)" />
                  <stop offset="50%" stopColor="#d4af37" />
                  <stop offset="100%" stopColor="#f4c430" />
                </linearGradient>
              </defs>
              <ReferenceLine
                y={initialPrice}
                stroke="rgba(245, 239, 224, 0.15)"
                strokeDasharray="3 3"
              />
              <XAxis dataKey="index" hide />
              <YAxis
                domain={[domainMin, domainMax]}
                hide
                padding={{ top: 10, bottom: 10 }}
              />
              <Tooltip content={<CustomTooltip />} />
              <Line
                type="monotone"
                dataKey="price"
                stroke="url(#goldStroke)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={true}
                animationDuration={800}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </div>

      <div className="divider-full mt-4" />
    </div>
  );
}