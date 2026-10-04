import { motion } from "framer-motion";
import { ArrowRight, BookOpen } from "lucide-react";
import { useParallaxOffset } from "../hooks/useParallax";
import { useSPVFees } from "../hooks/useSPVFees";
import WalletButton from "./WalletButton";

export default function Hero() {
  const offset1 = useParallaxOffset(0.15);
  const offset2 = useParallaxOffset(0.3);
  const { priceDisplay, loading } = useSPVFees();

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16">
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl opacity-30 bg-spv-accent animate-float-slow"
        style={{ transform: `translateY(${offset1}px)` }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl opacity-20 bg-spv-accent2 animate-float-medium"
        style={{ transform: `translateY(${offset2}px)` }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center" style={{ transform: `translateY(${-offset1}px)` }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 glass rounded-full px-4 py-2 mb-8 text-xs sm:text-sm"
        >
          <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
          <span className="text-white/80">Live on Polygon · USDT-quoted</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black leading-tight mb-6"
        >
          <span className="gradient-text">Mint-on-Demand</span>
          <br />
          <span>Bonding Curve Token</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-base sm:text-lg text-white/70 max-w-2xl mx-auto mb-10"
        >
          SPV starts at 0.01 USDT, mints on every buy, and burns on every sell.
          Dynamic fees reward holders. When 2 of 3 conditions are met, liquidity
          migrates automatically to QuickSwap and locks forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center mb-12"
        >
          <WalletButton />
          <a href="#docs" className="glass-button text-sm flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Read Docs
            <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.5 }}
          className="inline-flex items-center gap-6 glass-strong rounded-2xl px-6 py-4"
        >
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Current Price</div>
            <div className="font-mono text-lg sm:text-xl font-bold">
              {loading ? "..." : `${priceDisplay} USDT`}
            </div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="text-left">
            <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">Initial</div>
            <div className="font-mono text-lg sm:text-xl font-bold">0.010000 USDT</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}