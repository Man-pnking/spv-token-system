import { useMousePosition } from "../hooks/useMousePosition";
import { useParallax } from "../hooks/useParallax";

export default function AnimatedBackground() {
  const mouse = useMousePosition();
  const scrollY = useParallax();

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{ contain: "strict" }}
    >
      <div className="absolute inset-0 bg-[#050510]" />

      {/* Butterfly 1 — sharp, 40px blur */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 6 + scrollY * 0.1}px, 0)`,
          willChange: "transform",
        }}
      >
        <img
          src="/ruby-diamond-32.svg"
          alt=""
          aria-hidden="true"
          className="select-none"
          style={{
            width: "110vw",
            height: "110vw",
            maxWidth: "none",
            opacity: 0.55,
            filter: "blur(40px) saturate(1.4)",
            animation: "butterfly-drift 60s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* Butterfly 2 — ghost, no blur, just opacity */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate3d(${mouse.x * 10}px, ${mouse.y * 10 + scrollY * 0.14}px, 0)`,
          willChange: "transform",
        }}
      >
        <img
          src="/ruby-diamond-32.svg"
          alt=""
          aria-hidden="true"
          className="select-none mix-blend-screen"
          style={{
            width: "110vw",
            height: "110vw",
            maxWidth: "none",
            opacity: 0.15,
            animation: "butterfly-drift 60s ease-in-out infinite reverse",
            willChange: "transform",
          }}
        />
      </div>

      {/* Aurora 1 — cyan, static */}
      <div
        className="absolute -top-1/3 -left-1/4 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,255,255,0.30) 0%, transparent 70%)",
          transform: `translate3d(${mouse.x * 15}px, ${mouse.y * 15 + scrollY * 0.12}px, 0)`,
          willChange: "transform",
        }}
      />

      {/* Aurora 2 — orange, static */}
      <div
        className="absolute -bottom-1/3 -right-1/4 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(255,140,0,0.25) 0%, transparent 70%)",
          transform: `translate3d(${mouse.x * -15}px, ${mouse.y * -15 - scrollY * 0.08}px, 0)`,
          willChange: "transform",
        }}
      />

      {/* Aurora 3 — deep cyan, static */}
      <div
        className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full"
        style={{
          background: "radial-gradient(circle, rgba(0,168,168,0.22) 0%, transparent 70%)",
          transform: `translate3d(${mouse.x * 10}px, ${mouse.y * 10 + scrollY * 0.06}px, 0)`,
          willChange: "transform",
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.02]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Noise */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
}