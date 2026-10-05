import { motion } from "framer-motion";
import { useParallax } from "../hooks/useParallax";
import { useMousePosition } from "../hooks/useMousePosition";

/**
 * ButterflyBanner
 * A large, centered butterfly that sits behind hero content.
 * Slow rotation, mouse parallax, subtle pulse on the glow ring.
 */
export default function ButterflyBanner() {
  const scrollY = useParallax();
  const mouse = useMousePosition();

  return (
    <div className="relative w-full h-[min(85vw,700px)] sm:h-[min(70vw,700px)] flex items-center justify-center pointer-events-none">
      <div
        className="absolute rounded-full"
        style={{
          width: "min(75vw, 620px)",
          height: "min(75vw, 620px)",
          background:
            "radial-gradient(circle, rgba(0,255,255,0.12) 0%, rgba(0,255,255,0.04) 40%, transparent 70%)",
          filter: "blur(40px)",
          transform: `translate(${mouse.x * 8}px, ${mouse.y * 8 + scrollY * 0.05}px)`,
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: "min(60vw, 480px)",
          height: "min(60vw, 480px)",
          background:
            "radial-gradient(circle, rgba(255,140,0,0.14) 0%, rgba(255,140,0,0.03) 50%, transparent 75%)",
          filter: "blur(50px)",
          transform: `translate(${mouse.x * -12}px, ${mouse.y * -12 + scrollY * 0.08}px)`,
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <motion.img
        src="/ruby-diamond-32.svg"
        alt=""
        aria-hidden="true"
        className="relative w-[min(75vw,560px)] h-[min(75vw,560px)] sm:w-[min(55vw,560px)] sm:h-[min(55vw,560px)] select-none"
        style={{
          filter:
            "drop-shadow(0 0 60px rgba(0,255,255,0.35)) drop-shadow(0 0 120px rgba(255,140,0,0.18))",
          transform: `translate(${mouse.x * 14}px, ${mouse.y * 14 + scrollY * 0.15}px)`,
          transition: "transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        initial={{ opacity: 0, scale: 0.92 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.6, ease: [0.16, 1, 0.3, 1] }}
      />

      <div
        className="absolute rounded-full"
        style={{
          width: "min(40vw, 320px)",
          height: "min(40vw, 320px)",
          border: "1px solid rgba(255,255,255,0.06)",
          transform: `translate(${mouse.x * 4}px, ${mouse.y * 4}px)`,
          transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />
    </div>
  );
}