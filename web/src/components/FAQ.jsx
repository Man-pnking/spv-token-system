import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import Animated from "./Animated";

const QUESTIONS = [
  { q: "What is SPV?", a: "SPV is a mint-on-demand ERC20 token on Polygon. Tokens are created only when users buy through the bonding curve and burned when they sell. There is no pre-mine and no team allocation." },
  { q: "How does the bonding curve work?", a: "The curve uses a constant product formula with virtual reserves. As USDT enters the curve, price rises. As tokens are sold back, price falls. Every trade is priced deterministically on-chain." },
  { q: "What are the fees?", a: "Buy has zero protocol fee, only a dynamic creator fee of 0.5% to 5%. Sell has a time-tiered fee of 15% down to 0.5% based on hold duration. A volume-scaled burn also applies on sells." },
  { q: "Where does the creator fee go?", a: "The creator fee is transferred immediately to the configured creator address on every buy and sell. The recipient can be updated by the owner but cannot be set to zero." },
  { q: "Is there a supply cap?", a: "No hard cap. Supply is elastic and backed by USDT held in the curve. Deflationary burn reduces supply during active trading and stops at 10% of peak supply." },
  { q: "What is migration?", a: "Migration is the automatic graduation from bonding curve to DEX. It triggers when 2 of 3 conditions are met: price reaches 5x, 5M tokens minted, or 500 unique buyers. Fallback is 90 days." },
  { q: "How is liquidity locked?", a: "On migration, all curve reserves become QuickSwap liquidity. The LP tokens are sent to 0x...dEaD and cannot be recovered. This makes liquidity permanent and rug-proof." },
  { q: "What happens after migration?", a: "Trading continues through the same router, which automatically routes orders to QuickSwap. All contract addresses remain the same, only the execution venue changes." },
  { q: "Is the contract audited?", a: "The system is fully tested on Polygon and reviewed against common attack vectors. A third-party audit is recommended before significant TVL. The contracts are verified on Polygonscan so anyone can inspect the source." },
  { q: "How do I verify the contract address?", a: "All contract addresses are displayed in the Docs section. Every address links directly to Polygonscan. Always verify the address before signing any transaction." },
];

export default function FAQ() {
  const [open, setOpen] = useState(null);

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <div className="mb-16">
        <div className="text-xs uppercase tracking-[0.3em] text-warm-mute mb-4">
          FAQ
        </div>
        <h2 className="text-4xl sm:text-6xl font-black leading-tight">
          Frequently <span className="gradient-text">asked</span>
        </h2>
      </div>

      <div>
        {QUESTIONS.map((item, i) => (
          <Animated key={i} variant="up" delay={i * 40}>
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