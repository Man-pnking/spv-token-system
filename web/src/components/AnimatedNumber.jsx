import { useEffect, useRef, useState } from "react";
import { useSpring, useTransform, motion } from "framer-motion";
import { formatUnits } from "viem";

export default function AnimatedNumber({
  value,
  decimals = 2,
  prefix = "",
  suffix = "",
  compact = false,
  unitsDecimals = 18,
  className = "",
  flash = true,
}) {
  const target = (() => {
    if (value === undefined || value === null) return 0;
    if (typeof value === "bigint") {
      const n = Number(formatUnits(value, unitsDecimals));
      return isFinite(n) ? n : 0;
    }
    return isFinite(Number(value)) ? Number(value) : 0;
  })();

  const spring = useSpring(target, {
    stiffness: 80,
    damping: 20,
    mass: 0.8,
  });

  const [text, setText] = useState(formatFinal(target));
  const [flashState, setFlashState] = useState("idle"); // "up" | "down" | "idle"
  const prevTarget = useRef(target);

  const display = useTransform(spring, (latest) => {
    const n = latest;
    if (!isFinite(n)) return formatFinal(0);
    return formatFinal(n);
  });

  function formatFinal(n) {
    if (compact) {
      if (n >= 1_000_000_000) return `${(n / 1_000_000_000).toFixed(2)}B`;
      if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(2)}M`;
      if (n >= 1_000) return `${(n / 1_000).toFixed(2)}K`;
    }
    return n.toLocaleString("en-US", {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
    });
  }

  useEffect(() => {
    spring.set(target);
  }, [target, spring]);

  useEffect(() => {
    const unsubscribe = display.on("change", (v) => setText(v));
    return () => unsubscribe();
  }, [display]);

  // Flash on direction change
  useEffect(() => {
    if (!flash) return;
    if (prevTarget.current === target) return;

    const dir = target > prevTarget.current ? "up" : "down";
    prevTarget.current = target;

    setFlashState(dir);
    const t = setTimeout(() => setFlashState("idle"), 900);
    return () => clearTimeout(t);
  }, [target, flash]);

  const flashStyles = (() => {
    if (!flash || flashState === "idle") return {};
    if (flashState === "up") {
      return {
        textShadow: "0 0 12px rgba(0, 255, 255, 0.7)",
        color: "rgba(255, 140, 0, 0.95)",
      };
    }
    if (flashState === "down") {
      return {
        textShadow: "0 0 8px rgba(255, 255, 255, 0.1)",
        color: "rgba(240, 240, 240, 0.5)",
      };
    }
    return {};
  })();

  return (
    <motion.span
      className={className}
      style={{
        ...flashStyles,
        transition: "color 0.6s ease, text-shadow 0.6s ease",
        display: "inline-block",
      }}
    >
      {prefix}
      {text}
      {suffix}
    </motion.span>
  );
}