import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useParallax } from "../hooks/useParallax";
import { useMousePosition } from "../hooks/useMousePosition";
import { useSPVFees } from "../hooks/useSPVFees";
import WalletButton from "./WalletButton";
import GraduationProgress from "./GraduationProgress";
import SPVMark from "./SPVMark";
import AnimatedNumber from "./AnimatedNumber";
import ButterflyBanner from "./ButterflyBanner";

export default function Hero() {
  const scrollY = useParallax();
  const mouse = useMousePosition();
  const { priceDisplay, loading } = useSPVFees();

  const heroOpacity = Math.max(0, 1 - scrollY / 700);
  const priceNumber = Number(priceDisplay);

  return (
    <div className="relative min-h-screen flex items-center justify-center overflow-hidden pt-32 pb-16">
      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(90vw, 900px)",
          height: "min(90vw, 900px)",
          top: "50%",
          left: "50%",
          marginLeft: "min(-45vw, -450px)",
          marginTop: "min(-45vw, -450px)",
          border: "1px solid rgba(0, 255, 255, 0.06)",
          transform: `translate(${mouse.x * 6}px, ${mouse.y * 6 + scrollY * 0.05}px)`,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div
        className="absolute rounded-full pointer-events-none"
        style={{
          width: "min(60vw, 600px)",
          height: "min(60vw, 600px)",
          top: "50%",
          left: "50%",
          marginLeft: "min(-30vw, -300px)",
          marginTop: "min(-30vw, -300px)",
          border: "1px dashed rgba(0, 255, 255, 0.05)",
          transform: `translate(${mouse.x * -10}px, ${mouse.y * -10 + scrollY * 0.08}px) rotate(${scrollY * 0.02}deg)`,
          transition: "transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <ButterflyBanner />
      </div>

      <div
        className="absolute pointer-events-none animate-float-slow"
        style={{
          top: "18%",
          left: "10%",
          opacity: 0.15,
          transform: `translate(${mouse.x * -14}px, ${mouse.y * -14 + scrollY * 0.22}px)`,
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <SPVMark size={48} />
      </div>

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
          className="inline-flex items-center gap-3 mb-10 text-label"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-pulse" />
          <span>Live on Polygon</span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="display-xl mb-10"
        >
          <span className="shimmer">Special Purpose Vehicle</span>
          <br />
          <span className="text-warm">SPV Token</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.5 }}
          className="text-body max-w-2xl mx-auto mb-14"
        >
          SPV starts at 0.01 USDT, mints on every buy, and burns on every sell.
          When the market proves demand, liquidity migrates to QuickSwap and locks forever.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.7 }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-14"
        >
          <WalletButton />
          <a href="#intro" className="btn-feedback btn-ghost inline-flex items-center gap-2 text-sm">
            Learn more <ArrowRight className="w-4 h-4" />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.9 }}
          className="inline-flex items-baseline gap-10 mb-16"
        >
          <div>
            <div className="text-label mb-2">Current price</div>
            <div className="text-mono text-2xl text-warm">
              {loading ? (
                "..."
              ) : (
                <>
                  <AnimatedNumber value={priceNumber} decimals={6} /> USDT
                </>
              )}
            </div>
          </div>
          <div className="w-px h-10 bg-[#00ffff]/20" />
          <div>
            <div className="text-label mb-2">Initial</div>
            <div className="text-mono text-2xl text-warm-dim">0.010000 USDT</div>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.1 }}
          className="pt-10"
        >
          <div className="divider mb-10" />
          <GraduationProgress />
        </motion.div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2"
        style={{ opacity: Math.max(0, 1 - scrollY / 400) }}
      >
        <div className="w-px h-10 bg-gradient-to-b from-transparent via-[#00ffff]/60 to-transparent mx-auto" />
        <div className="text-label mt-2 text-center">Scroll</div>
      </motion.div>
    </div>
  );
}