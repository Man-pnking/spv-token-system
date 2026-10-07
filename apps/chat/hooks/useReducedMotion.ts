"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe reduced-motion detection.
 * Returns `false` on the server and first client render,
 * then `true` if the user has `prefers-reduced-motion: reduce`.
 * Guarantees no hydration mismatch.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return reduced;
}
