import { motion } from "framer-motion";
import { useSPVFees } from "../hooks/useSPVFees";
import AnimatedNumber from "./AnimatedNumber";

function StatBlock({ label, value, sub, delay, prefix, suffix, decimals, compact }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay, ease: [0.16, 1, 0.3, 1] }}
      className="flex-1 min-w-0"
    >
      <div className="text-label mb-3">{label}</div>
      <div className="text-mono text-4xl sm:text-5xl md:text-6xl font-black text-warm leading-none">
        <AnimatedNumber
          value={value}
          decimals={decimals ?? 0}
          compact={compact}
          prefix={prefix}
          suffix={suffix}
        />
      </div>
      <div className="text-xs text-warm-mute mt-3">{sub}</div>
    </motion.div>
  );
}

export default function StatsStrip() {
  const s = useSPVFees();

  if (s.loading) {
    return (
      <div className="border-y border-[#00ffff]/10">
        <div className="max-w-6xl mx-auto px-6 py-10">
          <div className="text-label">Loading stats…</div>
        </div>
      </div>
    );
  }

  // Rough market cap = price * total supply
  const priceUsdt = Number(s.priceDisplay);
  const totalSupply = Number(s.totalMinted) / 1e18;
  const marketCap = priceUsdt * totalSupply;

  return (
    <div className="border-y border-[#00ffff]/10">
      <div className="max-w-6xl mx-auto px-6 py-12">
        <div className="flex flex-col sm:flex-row divide-y sm:divide-y-0 sm:divide-x divide-[#00ffff]/10 gap-y-8 sm:gap-y-0 sm:gap-x-8">
          <StatBlock
            label="Unique buyers"
            value={s.uniqueBuyers}
            sub="Wallets that have bought"
            delay={0.1}
          />
          <div className="sm:pl-8">
            <StatBlock
              label="Market cap"
              value={marketCap}
              sub="USDT, price times minted supply"
              prefix="$"
              decimals={2}
              compact
              delay={0.2}
            />
          </div>
          <div className="sm:pl-8">
            <StatBlock
              label="Migration progress"
              value={s.progress}
              sub={`${s.triggersMet} of 2 triggers met`}
              decimals={1}
              suffix="%"
              delay={0.3}
            />
          </div>
        </div>
      </div>
    </div>
  );
}