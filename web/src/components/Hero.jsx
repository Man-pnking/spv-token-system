import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useParallax } from "../hooks/useParallax";
import { useMousePosition } from "../hooks/useMousePosition";
import { useSPVFees } from "../hooks/useSPVFees";
import WalletButton from "./WalletButton";

export default function Hero() {
  const scrollY = useParallax();
  const mouse = useMousePosition();
  const { priceDisplay, loading } = useSPVFees();

  const heroOpacity = Math.max(0, 1 - scrollY / 700);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16">
      <div
        className="absolute top-[20%] left-[15%] w-3 h-3 rounded-full bg-[#d4af37] shadow-[0_0_40px_#d4af37] animate-float-slow"
        style={{ transform: `translateY(${scrollY * 0.4}px)` }}
      />
      <div
        className="absolute bottom-[25%] right-[20%] w-2 h-2 rounded-full bg-[#f4c430] shadow-[0_0_30px_#f4c430] animate-float-medium"
        style={{ transform: `translateY(${scrollY * 0.25}px)` }}
      />
      <div
        className="absolute top-[40%] right-[10%] w-1.5 h-1.5 rounded-full bg-[#7c5cff] shadow-[0_0_20px_#7c5cff] animate-float-fast"
        style={{ transform: `translateY(${scrollY * 0.55}px)` }}
      />

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
        style={{
          opacity: heroOpacity,
          transform: `translateY(${scrollY * 0.25}px)`,
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-flex items-center gap-3 mb-10 text-xs"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="text-warm-dim tracking-[0.3em] uppercase">
            Live on Polygon
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="text-5xl sm:text-7xl md:text-8xl font-black leading-[0.95] mb-10"
        >
          <span className="gradient-text">Special Purpose Vehicle</span>
          <br />
          <span className="text-warm">SPV Token</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-lg sm:text-xl text-warm-dim max-w-2xl mx-auto mb-14 leading-relaxed"
        >
          SPV starts at 0.01 USDT, mints on every buy, and burns on every sell.
          When the market proves demand, liquidity migrates to QuickSwap and locks forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-20"
        >
          <WalletButton />
          <a href="#intro" className="btn-ghost inline-flex items-center gap-2 text-sm">
            Learn more <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="inline-flex items-baseline gap-10"
        >
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute mb-2">
              Current price
            </div>
            <div className="font-mono text-2xl text-warm">
              {loading ? "..." : `${priceDisplay} USDT`}
            </div>
          </div>
          <div className="w-px h-10 bg-[#d4af37]/20" />
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute mb-2">
              Initial
            </div>
            <div className="font-mono text-2xl text-warm-dim">0.010000 USDT</div>
          </div>
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
        style={{ opacity: Math.max(0, 1 - scrollY / 400) }}
      >
        <div className="w-px h-12 bg-gradient-to-b from-transparent via-[#d4af37]/60 to-transparent mx-auto" />
        <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute mt-3 text-center">
          Scroll
        </div>
      </motion.div>
    </div>
  );
}