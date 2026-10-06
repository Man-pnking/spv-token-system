import { useState } from "react";
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
    q: "Who controls the contract?",
    a: "The owner's powers are limited by design. The owner can pause trading, update the creator fee recipient, update fee tiers, and force migration. The owner cannot withdraw user reserves, mint tokens outside the curve logic, or change the bonding curve formula. Every contract is verified on Polygonscan and readable by anyone.",
  },
  {
    q: "What happens if a bug is found?",
    a: "The contracts are verified on Polygonscan — the exact code running on-chain is readable by anyone. The system includes 24 automated tests covering trade logic, fee calculation, migration, and access control. If an issue is discovered, the owner can pause the curve to prevent further trades. Existing balances remain on-chain and unaffected by the pause.",
  },
  {
    q: "What is the worst-case scenario?",
    a: "If interest fades, price could drift back toward the initial level. Graduation still happens — either by market trigger or the 90-day guarantee. The QuickSwap pool created would then be small and trading slower. As with any token, price can fall as well as rise. Only commit what you can afford to hold.",
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
    q: "What is the creator fee for?",
    a: "The creator fee is dynamic — between 0.5% and 5% — and it decreases as the price rises. It funds ongoing development of the SPV ecosystem, including future creator rewards, integrations, and audits. The fee is verifiable on-chain at any time by reading the bonding curve contract.",
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
    q: "How can I trust the contracts?",
    a: "Every SPV contract is verified on Polygonscan — the bytecode deployed on-chain matches the published source code exactly. Anyone can read, inspect, and audit the code independently. The system runs 24 automated tests covering trade logic, fee calculation, migration, and access control. The code is open and permanent.",
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
          The hard questions first.
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
