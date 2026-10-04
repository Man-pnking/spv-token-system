import { motion } from "framer-motion";
import { Coins, Lock, Sparkles, ArrowRight } from "lucide-react";

const STEPS = [
  { icon: Coins, title: "Buy with USDT", desc: "USDT enters the curve. SPV mints on demand. Price rises along a constant product curve." },
  { icon: Lock, title: "Hold or Trade", desc: "Sell fees drop from 15% to 0.5% as hold time grows. Burn scales with volume." },
  { icon: Sparkles, title: "Auto Migration", desc: "When 2 of 3 triggers hit (price 5x, 5M minted, 500 holders), reserves move to QuickSwap." },
  { icon: ArrowRight, title: "Trade on DEX", desc: "Liquidity locked forever. LP tokens burned. Same router routes all trades to the DEX." },
];

export default function HowItWorks() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-5xl font-black mb-4">
          How it <span className="gradient-text">Works</span>
        </h2>
        <p className="text-white/60 max-w-2xl mx-auto">
          Four steps from launch to permanently locked DEX liquidity.
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        {STEPS.map((step, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass-strong rounded-2xl p-6 relative"
          >
            <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full glow-btn flex items-center justify-center text-xs font-black">
              {i + 1}
            </div>
            <step.icon className="w-8 h-8 text-spv-accent mb-4" />
            <h3 className="text-lg font-bold mb-2">{step.title}</h3>
            <p className="text-sm text-white/60 leading-relaxed">{step.desc}</p>
          </motion.div>
        ))}
      </div>
    </div>
  );
}