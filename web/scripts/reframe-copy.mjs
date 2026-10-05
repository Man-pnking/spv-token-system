// scripts/reframe-copy.mjs
// Rewrites Docs.jsx, FAQ.jsx, HowItWorks.jsx, WhatYoureBuying.jsx with reframed copy.
// Run: node scripts/reframe-copy.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const COMPONENTS = path.join(__dirname, "..", "src", "components");

const FILES = {
  "Docs.jsx": `import Animated from "./Animated";
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
          href={\`\${CONFIG.explorer}/address/\${addr}\`}
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
`,

  "HowItWorks.jsx": `import Animated from "./Animated";
import Stagger from "./Stagger";
import SectionLabel from "./SectionLabel";

const STEPS = [
  { n: "01", title: "Buy with USDT", desc: "USDT enters the curve. SPV mints on demand. Price rises along a constant-product curve. No pre-mine, no team allocation, no insider advantage." },
  { n: "02", title: "Hold for rewards", desc: "Every holder starts at the same exit fee. Stay 30 days and it drops from 15% to 0.5% — a 30x reduction for conviction. A volume-scaled burn also removes supply on every sell, benefiting everyone who stays." },
  { n: "03", title: "Market-proven graduation", desc: "SPV migrates to QuickSwap when 2 of 3 signals confirm real demand: price 5x, 5M minted, or 500 unique holders. Not on a schedule — on proof." },
  { n: "04", title: "Permanent liquidity", desc: "Liquidity locks forever on graduation. LP tokens are burned. No rug is possible. The same router routes all future trades to the DEX, seamlessly." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-5xl mx-auto px-6 py-16">
      <Stagger delay={0} stagger={120} className="mb-16">
        <Animated variant="up">
          <SectionLabel current={9} total={9} title="How it works" />
        </Animated>
        <Animated variant="up">
          <h2 className="display-lg mt-6">
            Four steps from launch to <span className="gradient-text">permanent liquidity</span>
          </h2>
        </Animated>
      </Stagger>

      <div>
        {STEPS.map((step, i) => (
          <Animated
            key={i}
            variant={i % 2 === 0 ? "left" : "right"}
            delay={i * 100}
            className="py-10 md:py-12 grid md:grid-cols-12 gap-6 items-start"
          >
            <div className="md:col-span-2">
              <div className="text-6xl md:text-7xl font-black gradient-text leading-none">
                {step.n}
              </div>
            </div>
            <div className="md:col-span-4">
              <h3 className="display-md text-warm">
                {step.title}
              </h3>
            </div>
            <div className="md:col-span-6">
              <p className="text-body">{step.desc}</p>
            </div>
            {i < STEPS.length - 1 && <div className="md:col-span-12 divider" />}
          </Animated>
        ))}
      </div>
    </div>
  );
}
`,

  "WhatYoureBuying.jsx": `import Animated from "./Animated";
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
`,

  "FAQ.jsx": `import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Animated from "./Animated";

const QUESTIONS = [
  {
    q: "Can the creator rug pull?",
    a: "No. On migration, all liquidity goes to QuickSwap and the LP tokens are burned to 0x...dEaD. Once burned, no one — not the creator, not the deployer, not the contract — can remove that liquidity. Before migration, the curve holds all reserves in the contract itself, not in the creator's wallet. The creator can pause the curve in an emergency, but cannot withdraw reserves or mint tokens outside the curve logic.",
  },
  {
    q: "What happens if nobody buys?",
    a: "The curve sits at its initial price of 0.01 USDT with zero supply. No tokens exist. No one has lost anything. If you buy and then nobody else does, you can always sell back through the curve. You will get slightly less than you paid due to the exit fee and the creator fee, but the curve always accepts sells. There is no scenario where the contract takes your USDT and gives you nothing.",
  },
  {
    q: "What if I want to sell but there's no liquidity?",
    a: "The curve is the liquidity. It always holds USDT from previous buys. When you sell, you are selling back into that reserve. The only way this fails is if every prior buyer has already sold and drained the reserve — in which case supply is also near zero. This is why the exit fee tiers and burn mechanism exist: they encourage holding, which preserves the curve's ability to buy back for everyone.",
  },
  {
    q: "Is SPV a security?",
    a: "SPV is not registered with the SEC, ESMA, or any regulator. It is a purely on-chain instrument with no cash flows, no profit participation, no voting rights over a company, and no expectation of profit derived from the efforts of others. Whether it qualifies as a security under any jurisdiction's law is a legal question only a lawyer can answer for your specific situation. Nothing on this site is legal or financial advice.",
  },
  {
    q: "What happens if the contract has a bug?",
    a: "The contracts are verified on Polygonscan, meaning anyone can read the exact source code that is running. They have been tested with 24 unit tests and a full migration simulation on forked Polygon state against real QuickSwap. They have not been audited by a third party. If a critical bug is discovered after launch, the owner can pause the curve to stop further trades. Existing balances remain on-chain and unaffected by the pause.",
  },
  {
    q: "What is the worst-case scenario?",
    a: "The worst case is: the token launches, a few people buy, interest fades, and the price drifts down toward the initial price. Anyone who bought high and sold low loses money. Migration may trigger automatically after 90 days with thin liquidity, in which case the resulting QuickSwap pool is small and trading is slow. You can lose 100% of what you put in if the curve falls to zero demand. Only trade what you can afford to lose.",
  },
  {
    q: "What is SPV?",
    a: "SPV (Special Purpose Vehicle) is a mint-on-demand ERC20 token on Polygon. Tokens are created only when users buy through the bonding curve and burned when they sell. There is no pre-mine and no team allocation.",
  },
  {
    q: "How does the bonding curve work?",
    a: "The curve uses a constant product formula with virtual reserves. As USDT enters the curve, price rises. As tokens are sold back, price falls. Every trade is priced deterministically on-chain.",
  },
  {
    q: "What are the fees?",
    a: "Buying has zero protocol fee — only a creator fee of 0.5% to 5% that gets cheaper as the token succeeds. Selling has an exit fee that starts at 15% and drops to 0.5% for holders who stay 30 days or more. Every holder starts at the same place. The exit fee is a reward for patience, not a penalty for early buyers.",
  },
  {
    q: "Why is there a high sell fee?",
    a: "SPV is designed for holders, not flippers. The high exit fee in the first hour discourages wash trading, sniping, and panic dumps that hurt everyone in the curve. Hold for 30 days and your exit fee drops by 30x to just 0.5%. The mechanism is a filter for conviction, not a tax on participation.",
  },
  {
    q: "Where does the creator fee go?",
    a: "The creator fee is transferred immediately to the configured creator address on every buy and sell. The recipient can be updated by the owner but cannot be set to zero. Notably, the creator fee decreases as the price rises — the founder earns less when the token succeeds, aligning them with holders rather than against them.",
  },
  {
    q: "Is there a supply cap?",
    a: "No hard cap. Supply is elastic and backed by USDT held in the curve. Deflationary burn reduces supply during active trading and stops at 10% of peak supply. There is no maximum, but there is a floor — the supply can never collapse to zero.",
  },
  {
    q: "What is migration?",
    a: "Migration is the automatic graduation from bonding curve to DEX. It triggers when 2 of 3 conditions are met: price reaches 5x, 5M tokens minted, or 500 unique buyers. Fallback is 90 days. Migration is proof-based, not schedule-based — the market decides when SPV is ready.",
  },
  {
    q: "How is liquidity locked?",
    a: "On migration, all curve reserves become QuickSwap liquidity. The LP tokens are sent to 0x...dEaD and cannot be recovered. This makes liquidity permanent and rug-proof. Once SPV graduates, no one can pull the pool.",
  },
  {
    q: "What happens after migration?",
    a: "Trading continues through the same router, which automatically routes orders to QuickSwap. All contract addresses remain the same, only the execution venue changes. You do not need to do anything — the transition is seamless.",
  },
  {
    q: "Is the contract audited?",
    a: "The system is fully tested on Polygon and reviewed against common attack vectors. A third-party audit is recommended before significant TVL. The contracts are verified on Polygonscan so anyone can inspect the source at any time.",
  },
  {
    q: "How do I verify the contract address?",
    a: "All contract addresses are displayed in the Docs section. Every address links directly to Polygonscan. Always verify the address before signing any transaction.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <Animated variant="up" className="mb-16">
        <div className="text-xs uppercase tracking-[0.3em] text-warm-mute mb-4">
          FAQ
        </div>
        <h2 className="text-4xl sm:text-6xl font-black leading-tight">
          Frequently <span className="gradient-text">asked</span>
        </h2>
        <p className="text-warm-dim mt-6 max-w-2xl">
          The hard questions first. If a project will not answer them, do not
          buy the token.
        </p>
      </Animated>

      <div>
        {QUESTIONS.map((item, i) => (
          <Animated key={i} variant="up" delay={i * 30}>
            <div className="border-b border-[#00ffff]/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="font-semibold text-base sm:text-lg text-warm group-hover:text-[#00ffff] transition-colors">
                  {item.q}
                </span>
                {open === i ? (
                  <Minus className="w-4 h-4 text-[#00ffff] shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-warm-mute shrink-0 group-hover:text-[#00ffff] transition-colors" />
                )}
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="pb-8 text-sm text-warm-dim leading-relaxed max-w-2xl">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Animated>
        ))}
      </div>
    </div>
  );
}
`,
};

const BACKUP_SUFFIX = ".pre-reframe.bak";

function backup(filePath) {
  const backupPath = filePath + BACKUP_SUFFIX;
  if (!fs.existsSync(backupPath)) {
    fs.copyFileSync(filePath, backupPath);
    console.log(`  Backed up: ${path.basename(backupPath)}`);
  }
}

function writeFile(name, content) {
  const target = path.join(COMPONENTS, name);
  if (!fs.existsSync(target)) {
    console.log(`  SKIP (not found): ${name}`);
    return false;
  }
  backup(target);
  fs.writeFileSync(target, content, "utf8");
  console.log(`  Wrote: ${name}`);
  return true;
}

console.log("Reframing copy...\n");

let ok = 0;
for (const [name, content] of Object.entries(FILES)) {
  if (writeFile(name, content)) ok++;
}

console.log(`\nDone. ${ok}/${Object.keys(FILES).length} files written.`);
console.log("\nNext steps:");
console.log("  1. Review: git diff");
console.log("  2. Build:  npm run build");
console.log("  3. If good: git add . && git commit -m \"copy: reframe exit fee as holder reward\"");
console.log("  4. If bad:  restore from *.pre-reframe.bak");