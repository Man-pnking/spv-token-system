import { useRef } from "react";
import { useElementProgress } from "../hooks/useParallax";

export default function ParallaxHeading({ children, intensity = 40 }) {
  const ref = useRef(null);
  const progress = useElementProgress(ref);

  return (
    <div
      ref={ref}
      style={{
        transform: `translateY(${progress * intensity}px)`,
        transition: "transform 0.1s linear",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}