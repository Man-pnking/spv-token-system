"use client";

import { useMotion } from "@/components/providers/MotionProvider";

/**
 * Ambient aurora — three blurred gradient blobs drifting behind the app.
 * Disabled when the user prefers reduced motion. Rendered once at the
 * root layout; fixed and pointer-events-none.
 */
export function AuroraBackground() {
  const { allow } = useMotion();

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 -z-10 overflow-hidden"
    >
      <div
        className={"aurora-blob " + (allow ? "animate-aurora" : "")}
        style={{
          width: "60vw", height: "60vw", top: "-15vw", left: "-10vw",
          background: "radial-gradient(circle at 30% 30%, rgba(0, 255, 255, 0.55), transparent 65%)",
        }}
      />
      <div
        className={"aurora-blob " + (allow ? "animate-aurora" : "")}
        style={{
          width: "55vw", height: "55vw", bottom: "-15vw", right: "-10vw",
          background: "radial-gradient(circle at 70% 70%, rgba(255, 140, 0, 0.35), transparent 65%)",
          animationDelay: "-8s",
        }}
      />
      <div
        className={"aurora-blob " + (allow ? "animate-aurora" : "")}
        style={{
          width: "40vw", height: "40vw", top: "40%", left: "35%",
          background: "radial-gradient(circle at 50% 50%, rgba(0, 168, 168, 0.35), transparent 65%)",
          animationDelay: "-16s",
        }}
      />
    </div>
  );
}
