import Animated from "./Animated";
import SectionWatermark from "./SectionWatermark";
import { Copy, ExternalLink } from "lucide-react";
import { CONFIG } from "../config";

const SELL_TIERS = [
  ["Under 1 hour", "15%"],
  ["1 to 24 hours", "10%"],
  ["1 to 7 days", "5%"],
  ["7 to 30 days", "2%"],
  ["Over 30 days", "0.5%"],
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
    <div className="flex items-center justify-between py-4 border-b border-[#00ffff]/10">
      <div className="min-w-0">
        <div className="text-label mb-1">{label}</div>
        <div className="text-mono text-xs sm:text-sm truncate text-warm-dim">{addr}</div>
      </div>
      <div className="flex items-center gap-1 shrink-0 ml-4">
        <button onClick={copy} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
          <Copy className="w-3.5 h-3.5 text-warm-dim" />
        </button>
        <a
          href={`${CONFIG.explorer}/address/${addr}`}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2 rounded-lg hover:bg-white/5 transition-colors"
        >
          <ExternalLink className="w-3.5 h-3.5 text-warm-dim" />
        </a>
      </div>
    </div>
  );
}

export default function Docs() {
  return (
    <div className="relative max-w-4xl mx-auto px-6 py-16 overflow-hidden">
      <SectionWatermark position="bottom-left" size={480} opacity={0.03} rotate={-12} />

      <div className="mb-24">
        <div className="text-label mb-4">Documentation</div>
        <h2 className="display-lg">
          Everything about <span className="gradient-text">SPV</span>
        </h2>
      </div>

      <Animated variant="up" className="mb-20">
        <h3 className="display-md text-warm mb-4">Dynamic Creator Fee</h3>
        <p className="text-body mb-8 max-w-3xl">
          The creator fee adjusts automatically from 0.5% to 5% based on price and
          volume. It decreases as price rises to reward holders and increases with
          daily volume to capture upside during active trading.
        </p>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-warm-mute text-left">
                <th className="py-3 pr-6 font-normal text-label">Scenario</th>
                <th className="py-3 pr-6 font-normal text-label">Price</th>
                <th className="py-3 pr-6 font-normal text-label">Volume</th>
                <th className="py-3 font-normal text-label">Fee</th>
              </tr>
            </thead>
            <tbody>
              {CREATOR_FEES.map(([s, p, v, f]) => (
                <tr key={s} className="border-t border-[#00ffff]/10">
                  <td className="py-3 pr-6 text-warm-dim">{s}</td>
                  <td className="py-3 pr-6 text-mono text-warm-dim">{p}</td>
                  <td className="py-3 pr-6 text-mono text-warm-dim">{v}</td>
                  <td className="py-3 text-mono text-[#00ffff]">{f}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Animated>

      <div className="divider mb-20" />

      <Animated variant="up" className="mb-20">
        <h3 className="display-md text-warm mb-4">Sell Fee Tiers</h3>
        <p className="text-body mb-8 max-w-3xl">
          Sell fees decrease with hold time. Long-term holders pay almost nothing.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
          {SELL_TIERS.map(([t, f]) => (
            <div key={t}>
              <div className="text-label mb-2">{t}</div>
              <div className="text-3xl font-black text-mono gradient-text">{f}</div>
            </div>
          ))}
        </div>
      </Animated>

      <div className="divider mb-20" />

      <Animated variant="up" className="mb-20">
        <h3 className="display-md text-warm mb-4">Burn Mechanism</h3>
        <p className="text-body max-w-3xl">
          Every sell burns 0.5% to 12% of the token amount, scaled by daily volume.
          Burn stops when total supply reaches the supply floor at 10% of peak supply.
          This prevents total supply collapse while keeping deflationary pressure
          during active trading.
        </p>
      </Animated>

      <div className="divider mb-20" />

      <Animated variant="up" className="mb-20">
        <h3 className="display-md text-warm mb-4">Migration Triggers</h3>
        <p className="text-body mb-6 max-w-3xl">
          The curve migrates to QuickSwap when 2 of 3 conditions are met:
        </p>
        <ul className="space-y-3 text-sm text-warm-dim mb-6">
          <li className="flex gap-3"><span className="text-[#00ffff]">01</span> Price reaches 5x the initial price (0.05 USDT)</li>
          <li className="flex gap-3"><span className="text-[#00ffff]">02</span> Total minted reaches 5,000,000 SPV</li>
          <li className="flex gap-3"><span className="text-[#00ffff]">03</span> Unique buyers reach 500</li>
        </ul>
        <p className="text-body max-w-3xl">
          Fallback: migration is forced after 90 days if no triggers fire. LP tokens
          are burned to the dead address, making liquidity permanent.
        </p>
      </Animated>

      <div className="divider mb-20" />

      <Animated variant="up">
        <h3 className="display-md text-warm mb-6">Contract Addresses</h3>
        <div>
          <CopyAddr label="SPV Token" addr={CONFIG.spvToken} />
          <CopyAddr label="Bonding Curve" addr={CONFIG.curve} />
          <CopyAddr label="Router" addr={CONFIG.router} />
          <CopyAddr label="USDT" addr={CONFIG.usdt} />
        </div>
      </Animated>
    </div>
  );
}