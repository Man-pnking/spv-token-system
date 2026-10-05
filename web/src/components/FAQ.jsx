import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Animated from "./Animated";

const QUESTIONS = [
  // --- Tough questions first ---
  {
    q: "Can the creator rug pull?",
    a: "No. On migration, all liquidity goes to QuickSwap and the LP tokens are burned to 0x...dEaD. Once burned, no one — not the creator, not the deployer, not the contract — can remove that liquidity. Before migration, the curve holds all reserves in the contract itself, not in the creator's wallet. The creator can pause the curve in an emergency, but cannot withdraw reserves or mint tokens outside the curve logic.",
  },
  {
    q: "What happens if nobody buys?",
    a: "The curve sits at its initial price of 0.01 USDT with zero supply. No tokens exist. No one has lost anything. If you buy and then nobody else does, you can always sell back through the curve. You will get slightly less than you paid due to the sell fee and the creator fee, but the curve always accepts sells. There is no scenario where the contract takes your USDT and gives you nothing.",
  },
  {
    q: "What if I want to sell but there's no liquidity?",
    a: "The curve is the liquidity. It always holds USDT from previous buys. When you sell, you are selling back into that reserve. The only way this fails is if every prior buyer has already sold and drained the reserve — in which case supply is also near zero. This is why the sell fee tiers and burn mechanism exist: they discourage panic selling and preserve the curve's ability to buy back.",
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
    a: "The worst case is: the token launches, a few people buy, interest fades, and the price drifts down toward the initial price. Early buyers who bought high and sold low lose money. Migration may trigger automatically after 90 days with thin liquidity, in which case the resulting QuickSwap pool is small and trading is slow. You can lose 100% of what you put in if the curve falls to zero demand. Only trade what you can afford to lose.",
  },

  // --- Original entries ---
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
    a: "Buy has zero protocol fee, only a dynamic creator fee of 0.5% to 5%. Sell has a time-tiered fee of 15% down to 0.5% based on hold duration. A volume-scaled burn also applies on sells.",
  },
  {
    q: "Where does the creator fee go?",
    a: "The creator fee is transferred immediately to the configured creator address on every buy and sell. The recipient can be updated by the owner but cannot be set to zero.",
  },
  {
    q: "Is there a supply cap?",
    a: "No hard cap. Supply is elastic and backed by USDT held in the curve. Deflationary burn reduces supply during active trading and stops at 10% of peak supply.",
  },
  {
    q: "What is migration?",
    a: "Migration is the automatic graduation from bonding curve to DEX. It triggers when 2 of 3 conditions are met: price reaches 5x, 5M tokens minted, or 500 unique buyers. Fallback is 90 days.",
  },
  {
    q: "How is liquidity locked?",
    a: "On migration, all curve reserves become QuickSwap liquidity. The LP tokens are sent to 0x...dEaD and cannot be recovered. This makes liquidity permanent and rug-proof.",
  },
  {
    q: "What happens after migration?",
    a: "Trading continues through the same router, which automatically routes orders to QuickSwap. All contract addresses remain the same, only the execution venue changes.",
  },
  {
    q: "Is the contract audited?",
    a: "The system is fully tested on Polygon and reviewed against common attack vectors. A third-party audit is recommended before significant TVL. The contracts are verified on Polygonscan so anyone can inspect the source.",
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
            <div className="border-b border-[#d4af37]/10">
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between gap-6 py-6 text-left group"
              >
                <span className="font-semibold text-base sm:text-lg text-warm group-hover:text-[#d4af37] transition-colors">
                  {item.q}
                </span>
                {open === i ? (
                  <Minus className="w-4 h-4 text-[#d4af37] shrink-0" />
                ) : (
                  <Plus className="w-4 h-4 text-warm-mute shrink-0 group-hover:text-[#d4af37] transition-colors" />
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