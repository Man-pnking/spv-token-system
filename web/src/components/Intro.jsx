import Animated from "./Animated";
import Stagger from "./Stagger";
import SectionLabel from "./SectionLabel";
import { Target, Eye, ArrowRight } from "lucide-react";

const HOW_TO_BUY = [
  { n: "01", title: "Get USDT on Polygon", desc: "Buy USDT on any exchange and withdraw it to your Polygon wallet. Any EVM wallet works." },
  { n: "02", title: "Connect your wallet", desc: "Click Connect, choose your wallet, and approve the connection. You stay in control." },
  { n: "03", title: "Approve USDT once", desc: "One-time approval lets the router spend USDT on your behalf. You can revoke it anytime." },
  { n: "04", title: "Enter the amount", desc: "Type USDT to spend or SPV to receive. The other field fills automatically." },
  { n: "05", title: "Confirm in wallet", desc: "Sign the transaction. SPV mints to your wallet instantly. The dynamic creator fee funds ongoing development." },
];

const ROADMAP = [
  { phase: "Stage 1 · Foundation", status: "Complete", items: ["Mint-on-demand token live on Polygon Mainnet", "Bonding curve with dynamic fees and burn", "Automatic migration to QuickSwap", "LP tokens burned for permanent liquidity"] },
  { phase: "Stage 2 · Adoption", status: "In Progress", items: ["Community building on X and Telegram", "Verified token metadata on DEX Screener and GeckoTerminal", "Public brand assets and logo across all platforms", "Growing toward the 500-holder signal that accelerates graduation"] },
  { phase: "Stage 3 · Utility", status: "Planned", items: ["SPV-gated access to premium tools and data", "Staking mechanism that rewards long-term holders", "Treasury funded by creator fees for buybacks and grants", "Cross-chain messaging to other EVM networks"] },
  { phase: "Stage 4 · Ecosystem", status: "Planned", items: ["SPV used as collateral in lending markets", "Partnerships with RWA and DePIN protocols", "Community governance over future parameters", "Audited, upgraded contracts with migration path"] },
];

const GOALS = [
  "Graduate to QuickSwap and lock liquidity permanently",
  "Reach 500 unique holders without paid marketing",
  "Build a treasury from creator fees to fund development",
  "Ship staking and holder rewards within six months",
  "Integrate SPV as collateral in at least one lending protocol",
  "Publish a full security audit after TVL stabilizes",
  "Add cross-chain SPV via LayerZero or Axelar",
  "Transition governance to the community",
];

export default function Intro() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Stagger delay={0} stagger={120} className="mb-20">
        <Animated variant="up">
          <SectionLabel current={1} total={8} title="What is SPV" />
        </Animated>
        <Animated variant="up">
          <h2 className="display-lg mt-6 mb-10">
            A token that <span className="gradient-text">mints itself</span> as the market demands.
          </h2>
        </Animated>
        <Animated variant="up">
          <p className="text-body max-w-3xl">
            SPV is a mint-on-demand token on Polygon. Buys mint, sells burn, price is set
            by a bonding curve. On graduation, liquidity migrates to QuickSwap and locks
            permanently.
          </p>
        </Animated>
      </Stagger>

      <div className="divider mb-20" />

      <Stagger delay={0} stagger={120} className="grid md:grid-cols-3 gap-12 mb-20">
        {[
          { title: "No pre-mine", desc: "Supply starts at zero. Every token in circulation was bought by a user." },
          { title: "Permanent liquidity", desc: "On migration, LP tokens are burned to 0x...dEaD. No rug possible." },
          { title: "Dynamic fees", desc: "Creator fee scales with price and volume. Sell fee drops with hold time." },
        ].map((item, i) => (
          <Animated key={i} variant="up">
            <h3 className="display-md text-warm mb-3">{item.title}</h3>
            <p className="text-body text-sm">{item.desc}</p>
            <div className="divider-full mt-6" />
          </Animated>
        ))}
      </Stagger>

      <Stagger delay={0} stagger={100} className="mb-20">
        <Animated variant="up">
          <SectionLabel current={3} total={9} title="How to buy" />
        </Animated>
        <Animated variant="up">
          <h3 className="display-lg mt-6 mb-14">
            Five steps to your <span className="gradient-text">first SPV</span>
          </h3>
        </Animated>
        {HOW_TO_BUY.map((step, i) => (
          <Animated key={i} variant="left">
            <div className="py-6 grid grid-cols-12 gap-4 sm:gap-6 items-start">
              <div className="col-span-2 sm:col-span-1 text-2xl sm:text-3xl font-black gradient-text leading-none pt-1">
                {step.n}
              </div>
              <div className="col-span-10 sm:col-span-11">
                <div className="text-warm font-bold text-lg mb-2">{step.title}</div>
                <div className="text-body text-sm">{step.desc}</div>
              </div>
              {i < HOW_TO_BUY.length - 1 && <div className="col-span-12 divider-full mt-6" />}
            </div>
          </Animated>
        ))}
      </Stagger>

      <Stagger delay={0} stagger={100} className="mb-20">
        <Animated variant="up">
          <SectionLabel current={4} total={9} title="Import SPV" />
        </Animated>
        <Animated variant="up">
          <h3 className="display-lg mt-6 mb-8">
            Add SPV to your <span className="gradient-text">wallet</span>
          </h3>
        </Animated>
        <Animated variant="up">
          <p className="text-body mb-8 max-w-2xl">
            Wallets do not automatically detect custom tokens. Import SPV using the
            contract address below. Your balance appears immediately.
          </p>
        </Animated>
        <Animated variant="up">
          <div className="text-mono text-sm sm:text-base break-all text-[#00ffff] py-6 border-y border-[#00ffff]/15">
            0x3d838A7aa293F4371F4C23dD0906FEaCa1b83FB3
          </div>
        </Animated>
        <Animated variant="up">
          <p className="text-xs text-warm-mute mt-4">
            MetaMask: Import Tokens, Custom Token, paste address, confirm
          </p>
        </Animated>
      </Stagger>

      <Stagger delay={0} stagger={100} className="mb-20">
        <Animated variant="up">
          <SectionLabel current={5} total={9} title="Future Plans" />
        </Animated>
        <Animated variant="up">
          <h3 className="display-lg mt-6 mb-14">
            How SPV grows in <span className="gradient-text">value</span>
          </h3>
        </Animated>
        <Animated variant="up">
          <p className="text-body mb-14 max-w-3xl">
            SPV is not a static token. The contract already supports dynamic fees,
            deflationary burn, and permanent liquidity. The plans below describe how the
            protocol evolves to become a durable, useful special purpose vehicle — not
            just a tradable token.
          </p>
        </Animated>
        {ROADMAP.map((phase, i) => (
          <Animated key={i} variant="up">
            <div className="py-6 grid grid-cols-12 gap-6 items-start">
              <div className="col-span-12 md:col-span-4">
                <div className="display-md text-warm">{phase.phase}</div>
                <div
                  className={`text-label mt-2 ${
                    phase.status === "Planned" ? "" : "!text-[#00ffff]"
                  }`}
                >
                  {phase.status}
                </div>
              </div>
              <div className="col-span-12 md:col-span-8">
                <ul className="space-y-3">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-warm-dim">
                      <span className="text-[#00ffff] mt-1">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
              {i < ROADMAP.length - 1 && <div className="col-span-12 divider-full mt-6" />}
            </div>
          </Animated>
        ))}
      </Stagger>

            <Animated variant="up" className="text-center pt-8">
        <div className="divider mb-10" />
        <h3 className="display-lg mb-6 text-warm">
          Built for the <span className="gradient-text">long term</span>
        </h3>
        <p className="text-body max-w-2xl mx-auto mb-10">
          SPV does not promise returns. It promises a transparent, rule-based system
          that anyone can inspect, verify, and use without permission.
        </p>
        <a href="#trade" className="btn-gold inline-flex items-center gap-3">
          Trade SPV <ArrowRight className="w-4 h-4" />
        </a>
      </Animated>
    </div>
  );
}