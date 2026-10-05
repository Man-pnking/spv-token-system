import Animated from "./Animated";
import Stagger from "./Stagger";
import SectionLabel from "./SectionLabel";
import SectionWatermark from "./SectionWatermark";
import { Coins, TrendingUp, Flame, Shield, XCircle } from "lucide-react";

const WHAT_IT_IS = [
  { icon: Coins, title: "Exposure to a bonding curve", desc: "Each SPV token represents a share of a mathematical curve. The price is set by the curve, not by a market maker or a team. Every trade is priced deterministically on-chain." },
  { icon: TrendingUp, title: "A position that mints on demand", desc: "Every new buy mints tokens. Every sell burns them. Supply expands and contracts with real demand — no pre-mine, no team allocation, no insider advantage." },
  { icon: Flame, title: "A deflationary asset on sells", desc: "A portion of every sell is burned permanently. Over time, active trading reduces total supply. The benefit accrues to every holder, not to any insider." },
  { icon: Shield, title: "A non-custodial position", desc: "You hold the tokens in your own wallet. No intermediary can freeze, seize, or control them. The contract is the only counterparty." },
];

const WHAT_IT_IS_NOT = [
  "Not equity in a company. SPV is not stock. There are no dividends, no profits, no ownership rights in any business.",
  "Not a security. It is not registered with any regulator. You buy it at your own risk and on your own judgment.",
  "Not a get-rich-quick scheme. The exit fee starts higher than most tokens and drops to one of the lowest in the market for holders who stay 30 days. SPV rewards conviction, not speculation.",
  "Not a governance token (yet). SPV holders do not currently vote on protocol decisions. Governance is a stated future goal.",
  "Not insurance. There is no fund protecting your position if the price collapses.",
];

export default function WhatYoureBuying() {
  return (
    <div className="relative max-w-5xl mx-auto px-6 py-16 overflow-hidden">
      <SectionWatermark position="right" size={520} opacity={0.035} rotate={8} />

      <Stagger delay={0} stagger={110} className="mb-16">
        <Animated variant="up">
          <SectionLabel current={3} total={9} title="What you are buying" />
        </Animated>
        <Animated variant="up">
          <h2 className="display-lg mt-6">
            Plain language, no <span className="gradient-text">marketing</span>.
          </h2>
        </Animated>
        <Animated variant="up">
          <p className="text-body max-w-3xl mt-8">
            Before you buy SPV, you should understand exactly what the token is,
            how its price is set, and what it is not. Nothing on this page is
            financial advice.
          </p>
        </Animated>
      </Stagger>

      <div className="divider mb-16" />

      <div className="mb-20">
        <Animated variant="up">
          <h3 className="display-md text-warm mb-10">What it is</h3>
        </Animated>
        <Stagger delay={0} stagger={110} className="grid md:grid-cols-2 gap-x-12 gap-y-10">
          {WHAT_IT_IS.map((item, i) => (
            <Animated key={i} variant="up">
              <div className="flex items-start gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: "rgba(0, 255, 255, 0.08)",
                    border: "1px solid rgba(0, 255, 255, 0.2)",
                  }}
                >
                  <item.icon className="w-5 h-5 text-[#00ffff]" />
                </div>
                <div>
                  <h4 className="text-warm font-bold mb-2">{item.title}</h4>
                  <p className="text-body text-sm">{item.desc}</p>
                </div>
              </div>
            </Animated>
          ))}
        </Stagger>
      </div>

      <div className="divider mb-16" />

      <div className="mb-16">
        <Animated variant="up">
          <h3 className="display-md text-warm mb-10">What it is not</h3>
        </Animated>
        <Stagger delay={0} stagger={90} className="space-y-5">
          {WHAT_IT_IS_NOT.map((item, i) => (
            <Animated key={i} variant="left">
              <div className="flex items-start gap-4">
                <XCircle className="w-5 h-5 text-warm-mute shrink-0 mt-0.5" />
                <p className="text-body text-sm">{item}</p>
              </div>
            </Animated>
          ))}
        </Stagger>
      </div>

      <Animated variant="up" className="pt-12">
        <div className="divider mb-10" />
        <h3 className="display-md text-warm mb-6">
          The simplest way to think about it
        </h3>
        <p className="text-body max-w-3xl">
          SPV is a bet that the bonding curve will attract more buyers than
          sellers over time. If more people buy, the price rises. If more sell,
          the price falls. The token has no cash flows, no promises, and no
          insiders. It is a pure exposure to the demand for the curve itself.
        </p>
      </Animated>
    </div>
  );
}
