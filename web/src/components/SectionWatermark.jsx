import { useRef } from "react";
import { useElementProgress } from "../hooks/useParallax";
import SPVMark from "./SPVMark";

export default function SectionWatermark({
  position = "right",
  size = 520,
  opacity = 0.035,
  rotate = 0,
  intensity = 60,
}) {
  const ref = useRef(null);
  const progress = useElementProgress(ref);

  const positionStyles = (() => {
    if (position === "right") return { right: "-120px", top: "10%" };
    if (position === "left") return { left: "-120px", top: "20%" };
    if (position === "center") return { left: "50%", top: "50%", marginLeft: "-260px", marginTop: "-260px" };
    if (position === "bottom-right") return { right: "-80px", bottom: "-120px" };
    if (position === "bottom-left") return { left: "-80px", bottom: "-120px" };
    return { right: "-120px", top: "10%" };
  })();

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none absolute select-none"
      style={{
        ...positionStyles,
        opacity,
        transform: `translateY(${progress * intensity}px) rotate(${rotate}deg)`,
        transition: "transform 0.15s linear",
        willChange: "transform",
        zIndex: 0,
      }}
    >
      <SPVMark size={size} />
    </div>
  );
}