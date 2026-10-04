import { motion } from "framer-motion";
import {
  Coins, Shield, Zap, AlertTriangle, CheckCircle2,
  Rocket, ArrowRight,
} from "lucide-react";

export default function Intro() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-24">
      {/* Hero explanation */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1 }}
        className="text-center mb-20"
      >
        <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-6 text-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-warm-dim tracking-wider uppercase">What is SPV</span>
        </div>
        <h2 className="text-3xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
          A token that <span className="gradient-text">mints itself</span>
          <br />
          as the market demands
        </h2>
        <p className="text-warm-dim max-w-3xl mx-auto text-base sm:text-lg leading-relaxed">
          SPV (Special Purpose Vehicle) is a mint-on-demand token on Polygon.
          Every buy mints new tokens. Every sell burns them. The price is set
          by a bonding curve — a mathematical formula that adjusts price as
          supply grows. When the market proves real demand, liquidity
          automatically migrates to a public DEX and locks forever.
        </p>
      </motion.div>

      {/* Three key properties */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2 }}
        className="grid md:grid-cols-3 gap-4 mb-24"
      >
        {[
          { icon: Coins, title: "No Pre-mine", desc: "Supply starts at zero. Every token in circulation was bought by a user." },
          { icon: Shield, title: "Permanent Liquidity", desc: "On migration, LP tokens are burned to 0x...dEaD. No rug possible." },
          { icon: Zap, title: "Dynamic Fees", desc: "Creator fee scales with price and volume. Sell fee drops with hold time." },
        ].map((item, i) => (
          <div key={i} className="glass-strong rounded-3xl p-6">
            <div className="w-12 h-12 rounded-2xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center mb-5">
              <item.icon className="w-5 h-5 text-[#d4af37]" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-warm">{item.title}</h3>
            <p className="text-sm text-warm-dim leading-relaxed">{item.desc}</p>
          </div>
        ))}
      </motion.div>

      {/* How to buy */}
      <div className="mb-24">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-black mb-10 text-warm"
        >
          How to <span className="gradient-text">buy SPV</span>
        </motion.h3>

        <div className="space-y-4">
          {[
            {
              n: "01",
              title: "Get USDT on Polygon",
              desc: "Buy USDT on any exchange and withdraw it to your Polygon wallet. Any EVM wallet works.",
            },
            {
              n: "02",
              title: "Connect your wallet",
              desc: "Click Connect, choose your wallet, and approve the connection. You stay in control.",
            },
            {
              n: "03",
              title: "Approve USDT once",
              desc: "One-time approval lets the router spend USDT on your behalf. You can revoke it anytime.",
            },
            {
              n: "04",
              title: "Enter the amount",
              desc: "Type USDT to spend or SPV to receive. The other field fills automatically.",
            },
            {
              n: "05",
              title: "Confirm in wallet",
              desc: "Sign the transaction. SPV mints to your wallet instantly. Creator fee goes to the project wallet.",
            },
          ].map((step, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.1 }}
              className="glass rounded-2xl p-5 flex items-start gap-5"
            >
              <div className="text-3xl font-black gradient-text leading-none pt-1">
                {step.n}
              </div>
              <div className="flex-1">
                <div className="text-warm font-bold mb-1">{step.title}</div>
                <div className="text-sm text-warm-dim leading-relaxed">{step.desc}</div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Import to wallet */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-strong rounded-3xl p-8 mb-24"
      >
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-xl bg-[#d4af37]/10 border border-[#d4af37]/20 flex items-center justify-center flex-shrink-0">
            <ArrowRight className="w-5 h-5 text-[#d4af37]" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-warm mb-2">Import SPV to your wallet</h3>
            <p className="text-sm text-warm-dim leading-relaxed">
              Wallets don't automatically detect custom tokens. Import SPV using the contract
              address below. You'll see your balance immediately.
            </p>
          </div>
        </div>
        <div className="glass rounded-xl p-4 font-mono text-sm break-all text-[#d4af37]">
          0x3d838A7aa293F4371F4C23dD0906FEaCa1b83FB3
        </div>
        <div className="mt-4 text-xs text-warm-mute">
          MetaMask: Import Tokens, Custom Token, paste address, confirm
        </div>
      </motion.div>

      {/* Roadmap */}
      <div className="mb-24">
        <motion.h3
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="text-2xl sm:text-3xl font-black mb-10 text-warm"
        >
          <span className="gradient-text">Roadmap</span>
        </motion.h3>

        <div className="relative">
          <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-[#d4af37]/40 via-[#d4af37]/10 to-transparent" />

          {[
            {
              phase: "Phase 1 — Live",
              status: "done",
              items: [
                "Contracts deployed on Polygon Mainnet",
                "All three contracts verified on Polygonscan",
                "Frontend launched at spv-token-system-brxa.vercel.app",
                "First buy executed, curve functioning",
              ],
            },
            {
              phase: "Phase 2 — Growth",
              status: "current",
              items: [
                "Logo submitted to Polygonscan",
                "Community building on X and Telegram",
                "Marketing push to drive unique buyers",
                "Migration triggers fire naturally",
              ],
            },
            {
              phase: "Phase 3 — Migration",
              status: "pending",
              items: [
                "Auto-migration to QuickSwap when 2 of 3 triggers met",
                "LP tokens burned to 0x...dEaD for permanent liquidity",
                "DEX Screener and GeckoTerminal auto-index the pool",
                "Token becomes discoverable to public traders",
              ],
            },
            {
              phase: "Phase 4 — Post-Migration",
              status: "pending",
              items: [
                "Verified metadata on DEX Screener",
                "Holder rewards considered",
                "Governance research",
                "Long-term liquidity stability",
              ],
            },
          ].map((phase, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="relative pl-14 mb-8 last:mb-0"
            >
              <div
                className={`absolute left-2 top-1 w-5 h-5 rounded-full border-2 ${
                  phase.status === "done"
                    ? "bg-[#d4af37] border-[#d4af37]"
                    : phase.status === "current"
                    ? "bg-[#0a0705] border-[#d4af37] animate-pulse"
                    : "bg-[#0a0705] border-[#d4af37]/30"
                }`}
              />
              <div className="glass-strong rounded-2xl p-5">
                <div className="flex items-center justify-between mb-3">
                  <div className="text-warm font-bold">{phase.phase}</div>
                  <div
                    className={`text-[10px] uppercase tracking-wider px-2 py-1 rounded-full ${
                      phase.status === "done"
                        ? "bg-[#d4af37]/20 text-[#d4af37]"
                        : phase.status === "current"
                        ? "bg-[#d4af37]/10 text-[#d4af37]"
                        : "bg-white/5 text-warm-mute"
                    }`}
                  >
                    {phase.status === "done"
                      ? "Complete"
                      : phase.status === "current"
                      ? "In Progress"
                      : "Planned"}
                  </div>
                </div>
                <ul className="space-y-2">
                  {phase.items.map((item, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-warm-dim">
                      <span className="text-[#d4af37] mt-0.5">·</span>
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Pros and Cons */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid md:grid-cols-2 gap-4"
      >
        {/* Pros */}
        <div className="glass-strong rounded-3xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <CheckCircle2 className="w-6 h-6 text-emerald-400" />
            <h3 className="text-xl font-black text-warm">Pros</h3>
          </div>
          <ul className="space-y-3">
            {[
              "No pre-mine. Every token was bought.",
              "No team allocation. No hidden wallets.",
              "Permanent liquidity. LP tokens burned.",
              "Dynamic creator fee scales with success.",
              "Sell fees reward patience.",
              "Open source. Verified on Polygonscan.",
              "Same contract works pre- and post-migration.",
              "Non-custodial. You hold your keys.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-warm-dim">
                <CheckCircle2 className="w-4 h-4 text-emerald-400/70 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Cons */}
        <div className="glass-strong rounded-3xl p-7">
          <div className="flex items-center gap-3 mb-6">
            <AlertTriangle className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-black text-warm">Cons and Risks</h3>
          </div>
          <ul className="space-y-3">
            {[
              "Early buyers pay the highest fees.",
              "Migration to DEX has no fixed timeline.",
              "Thin liquidity means higher slippage.",
              "New tokens face distrust from traders.",
              "Creator wallet can pause the curve.",
              "Not audited by a third party yet.",
              "Small trades pay disproportionate gas.",
              "Value depends on adoption, not guarantees.",
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-3 text-sm text-warm-dim">
                <AlertTriangle className="w-4 h-4 text-amber-400/70 mt-0.5 flex-shrink-0" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </motion.div>

      {/* Final CTA */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center mt-24"
      >
        <div className="divider-gold mb-12" />
        <Rocket className="w-8 h-8 text-[#d4af37] mx-auto mb-5" />
        <h3 className="text-2xl sm:text-4xl font-black mb-4 text-warm">
          Built for the long term
        </h3>
        <p className="text-warm-dim max-w-2xl mx-auto mb-8">
          SPV doesn't promise returns. It doesn't promise hype. It promises
          a transparent, rule-based system that anyone can inspect, verify,
          and use without permission.
        </p>
        <a href="#trade" className="glow-btn inline-flex items-center gap-2 rounded-full px-8 py-4">
          Trade SPV <ArrowRight className="w-4 h-4" />
        </a>
      </motion.div>
    </div>
  );
}