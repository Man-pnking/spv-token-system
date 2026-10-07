"use client";

import { useEffect, useRef } from "react";

type Options = {
  radius?: number;
  opacity?: number;
  disabled?: boolean;
};

/**
 * Tracks the cursor and writes CSS vars (--cursor-x, --cursor-y)
 * onto a target element. The visual glow is drawn by a sibling
 * element reading those vars. SSR-safe: no DOM access until mounted.
 * Skips on touch-only devices.
 */
export function useCursorGlow<T extends HTMLElement = HTMLDivElement>(
  options: Options = {}
) {
  const { radius = 400, opacity = 0.15, disabled = false } = options;
  const ref = useRef<T | null>(null);

  useEffect(() => {
    if (disabled) return;
    const el = ref.current;
    if (!el) return;

    if (typeof window !== "undefined" && window.matchMedia("(hover: none)").matches) {
      return;
    }

    let raf = 0;
    let targetX = 0, targetY = 0, currentX = 0, currentY = 0, first = true;

    const onMove = (e: PointerEvent) => {
      const rect = el.getBoundingClientRect();
      targetX = e.clientX - rect.left;
      targetY = e.clientY - rect.top;
      if (first) { currentX = targetX; currentY = targetY; first = false; }
    };

    const tick = () => {
      currentX += (targetX - currentX) * 0.12;
      currentY += (targetY - currentY) * 0.12;
      el.style.setProperty("--cursor-x", `${currentX}px`);
      el.style.setProperty("--cursor-y", `${currentY}px`);
      raf = requestAnimationFrame(tick);
    };

    el.style.setProperty("--cursor-radius", `${radius}px`);
    el.style.setProperty("--cursor-opacity", String(opacity));

    window.addEventListener("pointermove", onMove, { passive: true });
    raf = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [radius, opacity, disabled]);

  return ref;
}
