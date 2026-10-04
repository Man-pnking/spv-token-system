import Animated from "./Animated";
import { useSPVFees } from "../hooks/useSPVFees";
import { formatSpv } from "../utils/format";

export default function CurveStats() {
  const s = useSPVFees();

  if (s.loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-32">
        <div className="text-center text-warm-mute">Loading curve stats...</div>
      </div>
    );
  }

  const stats = [
    { label: "Price", value: s.priceDisplay, sub: "USDT per SPV" },
    { label: "Creator Fee", value: `${s.creatorFeePct.toFixed(2)}%`, sub: "Dynamic" },
    { label: "Burn Rate", value: `${s.burnPct.toFixed(2)}%`, sub: "Per sell" },
    { label: "Total Minted", value: formatSpv(s.totalMinted), sub: "Lifetime SPV" },
    { label: "Unique Buyers", value: s.uniqueBuyers.toString(), sub: "Distinct addresses" },
    { label: "Supply Floor", value: formatSpv(s.supplyFloor), sub: "Burn stops here" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-20">
        <div className="text-xs uppercase tracking-[0.3em] text-warm-mute mb-4">
          Live Curve Stats
        </div>
        <h2 className="text-4xl sm:text-6xl font-black leading-tight">
          Numbers from the <span className="gradient-text">chain</span>
        </h2>
        <p className="text-warm-dim mt-5 max-w-2xl">
          Every value below is read directly from the SPV Bonding Curve contract on
          Polygon. Refreshed every twelve seconds.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-14">
        {stats.map((stat, i) => (
          <Animated key={i} variant="up" delay={i * 80}>
            <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-3">
              {stat.label}
            </div>
            <div className="text-4xl sm:text-5xl font-black font-mono text-warm leading-none">
              {stat.value}
            </div>
            <div className="text-xs text-warm-mute mt-3">{stat.sub}</div>
            <div className="divider-full mt-6" />
          </Animated>
        ))}
      </div>

      <Animated variant="up" delay={100} className="mt-20">
        <div className="text-xs uppercase tracking-[0.3em] text-warm-mute mb-6">
          Migration Progress
        </div>
        <div className="flex items-baseline justify-between mb-8">
          <div className="text-5xl sm:text-7xl font-black gradient-text">
            {s.progress.toFixed(1)}%
          </div>
          <div className="text-sm text-warm-dim">{s.triggersMet} of 2 triggers met</div>
        </div>

        <div className="space-y-8">
          {[
            { label: "Price at 5x initial", ok: s.priceOk, value: s.priceRatio / 5 },
            { label: "Total minted at 5,000,000 SPV", ok: s.supplyOk, value: Number(s.totalMinted) / 5e24 },
            { label: "500 unique buyers", ok: s.holdersOk, value: s.uniqueBuyers / 500 },
          ].map((trigger, i) => (
            <Animated key={i} variant="left" delay={i * 120}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-warm-dim">{trigger.label}</span>
                <span className={trigger.ok ? "text-[#d4af37]" : "text-warm-mute"}>
                  {trigger.ok ? "Met" : "Pending"}
                </span>
              </div>
              <div className="h-px bg-white/5 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#d4af37] to-[#f4c430] transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, trigger.value * 100))}%` }}
                />
              </div>
            </Animated>
          ))}
        </div>
      </Animated>
    </div>
  );
}