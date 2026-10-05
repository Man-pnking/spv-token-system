import { useEffect, useState, useRef } from "react";

export function useParallax() {
  const [scrollY, setScrollY] = useState(0);
  const ticking = useRef(false);
  const lastValue = useRef(0);

  useEffect(() => {
    const update = () => {
      const current = window.scrollY;

      if (Math.abs(current - lastValue.current) > 1) {
        lastValue.current = current;
        setScrollY(current);
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollY;
}

export function useParallaxOffset(factor = 0.3) {
  const scrollY = useParallax();
  return scrollY * factor;
}

/**
 * Tracks how far an element has scrolled through the viewport.
 * Returns 0 when the element just enters from the bottom,
 * and 1 when it fully exits through the top.
 * rAF-throttled to avoid re-render storms.
 */
export function useElementProgress(ref) {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);
  const lastValue = useRef(-1);

  useEffect(() => {
    const update = () => {
      const el = ref.current;
      if (el) {
        const rect = el.getBoundingClientRect();
        const viewportH = window.innerHeight;
        const total = viewportH + rect.height;
        const scrolled = viewportH - rect.top;
        const p = Math.max(0, Math.min(1, scrolled / total));

        if (Math.abs(p - lastValue.current) > 0.002) {
          lastValue.current = p;
          setProgress(p);
        }
      }
      ticking.current = false;
    };

    const onScroll = () => {
      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ref]);

  return progress;
}