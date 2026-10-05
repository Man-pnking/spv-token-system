import Animated from "./Animated";
import SectionWatermark from "./SectionWatermark";
import { Copy, ExternalLink } from "lucide-react";
import { CONFIG } from "../config";

const SELL_TIERS = [
  ["First hour", "15%", "Same for everyone"],
  ["1-24 hours", "10%", "1.5x cheaper"],
  ["1-7 days", "5%", "3x cheaper"],
  ["7-30 days", "2%", "7.5x cheaper"],
  ["30+ days", "0.5%", "30x cheaper"],
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
        <p className="text-body mt-6 max-w-3xl">
          Every number on this page is enforced on-chain. Nothing here is a
          promise — it is the current state of the contracts.
        </p>
      </div>

      <Animated variant="up" className="mb-20">
        <h3 className="display-md text-warm mb-4">Creator Fee</h3>
        <p className="text-body mb-8 max-w-3xl">
          The creator earns less as the token succeeds. As price rises, the fee
          shrinks. As volume grows, it grows. This means the creator's incentive
          is aligned with holders — success reduces the founder's cut, not
          increases it.
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
        <h3 className="display-md text-warm mb-4">Exit Rewards</h3>
        <p className="text-body mb-8 max-w-3xl">
          Every holder starts at the same place. The longer you hold, the less
          you pay to exit. Hold for 30 days and your exit fee drops from 15% to
          0.5% — a 30x reduction available to anyone with conviction. This is
          how SPV rewards patience over speculation.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-8">
          {SELL_TIERS.map(([t, f, note]) => (
            <div key={t}>
              <div className="text-label mb-2">{t}</div>
              <div className="text-3xl font-black text-mono gradient-text mb-2">{f}</div>
              <div className="text-xs text-warm-mute">{note}</div>
            </div>
          ))}
        </div>
      </Animated>

      <div className="divider mb-20" />

      <Animated variant="up" className="mb-20">
        <h3 className="display-md text-warm mb-4">Deflation</h3>
        <p className="text-body max-w-3xl">
          Every sell burns a portion of the token amount, scaled by daily
          volume. Burn stops at 10% of peak supply so the token never collapses
          to zero. Active trading makes SPV scarcer over time — a benefit that
          accrues to every holder, not to any insider.
        </p>
      </Animated>

      <div className="divider mb-20" />

      <Animated variant="up" className="mb-20">
        <h3 className="display-md text-warm mb-4">Graduation</h3>
        <p className="text-body mb-6 max-w-3xl">
          SPV graduates from the curve to QuickSwap when the market proves real
          demand. Two of three conditions must be met:
        </p>
        <ul className="space-y-3 text-sm text-warm-dim mb-6">
          <li className="flex gap-3"><span className="text-[#00ffff]">01</span> Price reaches 5x the initial price (0.05 USDT)</li>
          <li className="flex gap-3"><span className="text-[#00ffff]">02</span> Total minted reaches 5,000,000 SPV</li>
          <li className="flex gap-3"><span className="text-[#00ffff]">03</span> Unique buyers reach 500</li>
        </ul>
        <p className="text-body max-w-3xl">
          If the market has not proven itself within 90 days, migration happens
          anyway. Either way, LP tokens are burned on migration — permanent
          liquidity, no exceptions, no rug.
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
