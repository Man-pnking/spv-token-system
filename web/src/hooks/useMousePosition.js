import { useEffect, useState, useRef } from "react";

export function useMousePosition() {
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const ticking = useRef(false);
  const target = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const update = () => {
      setPos(target.current);
      ticking.current = false;
    };

    const onMove = (e) => {
      target.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };

      if (!ticking.current) {
        ticking.current = true;
        requestAnimationFrame(update);
      }
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return pos;
}