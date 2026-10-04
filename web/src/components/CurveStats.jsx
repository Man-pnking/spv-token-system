import { motion } from "framer-motion";
import { TrendingUp, Flame, Users, Coins, Shield, Percent } from "lucide-react";
import { useSPVFees } from "../hooks/useSPVFees";
import { formatSpv } from "../utils/format";
import StatCard3D from "./StatCard3D";

export default function CurveStats() {
  const s = useSPVFees();

  if (s.loading) {
    return (
      <div className="max-w-7xl mx-auto px-6 py-24">
        <div className="text-center text-white/50">Loading curve stats...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-black mb-4">
          Live <span className="gradient-text">Curve Stats</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          All values update on-chain in real time. Refreshed every 12 seconds.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        <StatCard3D icon={TrendingUp} label="Price" value={s.priceDisplay} sub="USDT per SPV" />
        <StatCard3D icon={Percent} label="Creator Fee" value={`${s.creatorFeePct.toFixed(2)}%`} sub="Dynamic" />
        <StatCard3D icon={Flame} label="Burn Rate" value={`${s.burnPct.toFixed(2)}%`} sub="Per sell" />
        <StatCard3D icon={Coins} label="Total Minted" value={formatSpv(s.totalMinted)} sub="Lifetime SPV" />
        <StatCard3D icon={Users} label="Unique Buyers" value={s.uniqueBuyers.toString()} sub="Distinct addresses" />
        <StatCard3D icon={Shield} label="Supply Floor" value={formatSpv(s.supplyFloor)} sub="Burn stops here" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-strong rounded-2xl p-6"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-bold">Migration Progress</h3>
            <p className="text-sm text-white/50 mt-1">{s.triggersMet} of 2 triggers met</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-black gradient-text">{s.progress.toFixed(1)}%</div>
            <div className="text-xs text-white/50">overall</div>
          </div>
        </div>

        <div className="space-y-4">
          <Trigger label="Price ≥ 5× initial" value={s.priceRatio / 5} ok={s.priceOk} />
          <Trigger label="Total minted ≥ 5,000,000 SPV" value={Number(s.totalMinted) / 5e24} ok={s.supplyOk} />
          <Trigger label="Unique buyers ≥ 500" value={s.uniqueBuyers / 500} ok={s.holdersOk} />
        </div>
      </motion.div>
    </div>
  );
}

function Trigger({ label, value, ok }) {
  const pct = Math.min(100, Math.max(0, value * 100));
  return (
    <div>
      <div className="flex items-center justify-between text-sm mb-2">
        <span className="text-white/70">{label}</span>
        <span className={ok ? "text-green-400" : "text-white/40"}>{ok ? "Met" : "Pending"}</span>
      </div>
      <div className="h-2 rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-spv-accent to-spv-accent2 transition-all"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}