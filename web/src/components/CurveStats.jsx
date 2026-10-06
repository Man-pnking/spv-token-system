import AnimatedNumber from "./AnimatedNumber";
import SectionLabel from "./SectionLabel";
import { useSPVFees } from "../hooks/useSPVFees";

export default function CurveStats() {
  const s = useSPVFees();

  if (s.loading) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16">
        <div className="text-center text-warm-mute text-sm">Loading curve stats…</div>
      </div>
    );
  }

  const priceNumber = Number(s.priceDisplay);
  const totalMintedNumber = Number(s.totalMinted) / 1e18;
  const supplyFloorNumber = Number(s.supplyFloor) / 1e18;

  return (
    <div className="max-w-6xl mx-auto px-6 py-16">
      <div className="mb-20">
        <SectionLabel current={3} total={8} title="Live Curve Stats" />
        <h2 className="text-4xl sm:text-6xl font-black leading-tight mt-6">
          Numbers from the <span className="gradient-text">chain</span>
        </h2>
        <p className="text-warm-dim mt-5 max-w-2xl">
          Every value below is read directly from the SPV Bonding Curve contract on
          Polygon. Refreshed every twelve seconds.
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-8 gap-y-14">
        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-3">Price</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-warm leading-none">
            <AnimatedNumber value={priceNumber} decimals={6} />
          </div>
          <div className="text-xs text-warm-mute mt-3">USDT per SPV</div>
          <div className="divider-full mt-6" />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-3">Creator Fee</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-warm leading-none">
            <AnimatedNumber value={s.creatorFeePct} decimals={2} suffix="%" />
          </div>
          <div className="text-xs text-warm-mute mt-3">Dynamic</div>
          <div className="divider-full mt-6" />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-3">Burn Rate</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-warm leading-none">
            <AnimatedNumber value={s.burnPct} decimals={2} suffix="%" />
          </div>
          <div className="text-xs text-warm-mute mt-3">Per sell</div>
          <div className="divider-full mt-6" />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-3">Total Minted</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-warm leading-none">
            <AnimatedNumber value={totalMintedNumber} decimals={2} compact />
          </div>
          <div className="text-xs text-warm-mute mt-3">Lifetime SPV</div>
          <div className="divider-full mt-6" />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-3">Unique Buyers</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-warm leading-none">
            <AnimatedNumber value={s.uniqueBuyers} decimals={0} />
          </div>
          <div className="text-xs text-warm-mute mt-3">Distinct addresses</div>
          <div className="divider-full mt-6" />
        </div>

        <div>
          <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-3">Supply Floor</div>
          <div className="text-4xl sm:text-5xl font-black font-mono text-warm leading-none">
            <AnimatedNumber value={supplyFloorNumber} decimals={2} compact />
          </div>
          <div className="text-xs text-warm-mute mt-3">Burn stops here</div>
          <div className="divider-full mt-6" />
        </div>
      </div>

      <div className="mt-24">
        <SectionLabel current={3} total={8} title="Migration Progress" />
        <div className="flex items-baseline justify-between mb-8 mt-6">
          <div className="text-5xl sm:text-7xl font-black gradient-text">
            <AnimatedNumber value={s.progress} decimals={1} suffix="%" />
          </div>
          <div className="text-sm text-warm-dim">
            <AnimatedNumber value={s.triggersMet} decimals={0} /> of 2 triggers met
          </div>
        </div>

        <div className="space-y-8">
          {[
            { label: "Price at 5x initial", ok: s.priceOk, value: s.priceRatio / 5, display: `${(s.priceRatio).toFixed(2)}x / 5.00x` },
            { label: "Total minted at 5,000,000 SPV", ok: s.supplyOk, value: Number(s.totalMinted) / 5e24, display: `${(Number(s.totalMinted) / 1e18).toLocaleString("en-US", { maximumFractionDigits: 0 })} / 5,000,000` },
            { label: "500 unique buyers", ok: s.holdersOk, value: s.uniqueBuyers / 500, display: `${s.uniqueBuyers} / 500` },
          ].map((trigger, i) => (
            <div key={i}>
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-warm-dim">{trigger.label}</span>
                <span className={trigger.ok ? "text-[#00ffff]" : "text-warm-mute"}>
                  {trigger.ok ? "Met" : trigger.display}
                </span>
              </div>
              <div className="h-px bg-white/5 relative overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#00ffff] to-[#ff8c00] transition-all duration-1000"
                  style={{ width: `${Math.min(100, Math.max(0, trigger.value * 100))}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}