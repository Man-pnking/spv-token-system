import { motion } from "framer-motion";
import { Copy, ExternalLink } from "lucide-react";
import { CONFIG } from "../config";

const FEES = [
  ["< 1 hour", "15%"],
  ["1-24 hours", "10%"],
  ["1-7 days", "5%"],
  ["7-30 days", "2%"],
  ["> 30 days", "0.5%"],
];

const CREATOR_FEES = [
  ["Just launched", "1x", "0", "2.0%"],
  ["Early activity", "1x", "5k USDT", "2.5%"],
  ["Growing", "2x", "10k USDT", "2.5%"],
  ["Strong demand", "5x", "50k USDT", "3.0%"],
  ["Mature", "10x", "100k USDT", "2.5%"],
  ["Cooled off", "10x", "100 USDT", "0.5%"],
];

function CopyAddr({ label, addr }) {
  const copy = () => navigator.clipboard.writeText(addr);
  return (
    <div className="glass rounded-xl p-3 flex items-center justify-between gap-3">
      <div className="min-w-0">
        <div className="text-[10px] uppercase tracking-wider text-white/50">{label}</div>
        <div className="font-mono text-xs truncate">{addr}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0">
        <button onClick={copy} className="p-2 rounded-lg hover:bg-white/10 transition-colors">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <a
          href={`${CONFIG.explorer}/address/${addr}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-white/10 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  );
}

export default function Docs() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-black mb-4">Documentation</h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Everything you need to understand the SPV economics and contracts.
        </p>
      </div>

      <div className="space-y-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Dynamic Creator Fee</h3>
          <p className="text-sm text-white/60 mb-4">
            The creator fee adjusts automatically from 0.5% to 5% based on price and volume.
            It decreases as price rises (rewarding holders) and increases with daily volume (capturing upside).
          </p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-white/40 text-left">
                  <th className="py-2 pr-4">Scenario</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Volume</th>
                  <th className="py-2">Fee</th>
                </tr>
              </thead>
              <tbody>
                {CREATOR_FEES.map(([s, p, v, f]) => (
                  <tr key={s} className="border-t border-white/5">
                    <td className="py-2 pr-4">{s}</td>
                    <td className="py-2 pr-4 font-mono">{p}</td>
                    <td className="py-2 pr-4 font-mono">{v}</td>
                    <td className="py-2 font-mono text-spv-accent">{f}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Sell Fee Tiers</h3>
          <p className="text-sm text-white/60 mb-4">
            Sell fees decrease with hold time. Long-term holders pay almost nothing.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
            {FEES.map(([t, f]) => (
              <div key={t} className="glass rounded-xl p-4 text-center">
                <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">{t}</div>
                <div className="text-xl font-bold font-mono text-spv-accent">{f}</div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Burn Mechanism</h3>
          <p className="text-sm text-white/60 leading-relaxed">
            Every sell burns 0.5% to 12% of the token amount, scaled by daily volume.
            Burn stops when total supply reaches the supply floor (10% of peak supply).
            This prevents total supply collapse while keeping deflationary pressure during active trading.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Migration Triggers</h3>
          <p className="text-sm text-white/60 mb-4">
            The curve migrates to QuickSwap when 2 of 3 conditions are met:
          </p>
          <ul className="space-y-2 text-sm text-white/70 mb-4">
            <li className="flex gap-3"><span className="text-spv-accent">1.</span> Price reaches 5x the initial price (0.05 USDT)</li>
            <li className="flex gap-3"><span className="text-spv-accent">2.</span> Total minted reaches 5,000,000 SPV</li>
            <li className="flex gap-3"><span className="text-spv-accent">3.</span> Unique buyers reach 500</li>
          </ul>
          <p className="text-sm text-white/60">
            Fallback: migration is forced after 90 days if no triggers fire. LP tokens are
            burned to the dead address, making liquidity permanent.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass-strong rounded-2xl p-6"
        >
          <h3 className="text-xl font-bold mb-4">Contract Addresses</h3>
          <div className="space-y-3">
            <CopyAddr label="SPV Token" addr={CONFIG.spvToken} />
            <CopyAddr label="Bonding Curve" addr={CONFIG.curve} />
            <CopyAddr label="Router" addr={CONFIG.router} />
            <CopyAddr label="USDT" addr={CONFIG.usdt} />
          </div>
        </motion.div>
      </div>
    </div>
  );
}