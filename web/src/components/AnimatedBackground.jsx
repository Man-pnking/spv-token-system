import { useMousePosition } from "../hooks/useMousePosition";
import { useParallax } from "../hooks/useParallax";

export default function AnimatedBackground() {
  const mouse = useMousePosition();
  const scrollY = useParallax();

  return (
    <div
      className="fixed inset-0 -z-10 overflow-hidden pointer-events-none"
      style={{
        transform: "translate3d(0, 0, 0)",
        willChange: "transform",
      }}
    >
      <div className="absolute inset-0 bg-[#050510]" />

      {/* ===== SHARP BUTTERFLY ===== */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate3d(${mouse.x * 6}px, ${mouse.y * 6 + scrollY * 0.1}px, 0)`,
          transition: "transform 1s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
          backfaceVisibility: "hidden",
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
            opacity: 0.80,
            filter: "saturate(1.4)",
            animation: "butterfly-drift 60s ease-in-out infinite",
            willChange: "transform",
          }}
        />
      </div>

      {/* ===== FROSTED GLASS PANEL ===== */}
      <div
        className="absolute inset-0"
        style={{
          backdropFilter: "blur(120px) saturate(200%) brightness(1.12)",
          WebkitBackdropFilter: "blur(120px) saturate(200%) brightness(1.12)",
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.06) 0%, rgba(5,5,16,0.20) 30%, rgba(5,5,16,0.28) 60%, rgba(255,255,255,0.04) 100%)",
          maskImage:
            "radial-gradient(ellipse 95% 80% at 50% 50%, black 35%, transparent 100%)",
          WebkitMaskImage:
            "radial-gradient(ellipse 95% 80% at 50% 50%, black 35%, transparent 100%)",
        }}
      />

      {/* ===== GLASS GRAIN ===== */}
      <div
        className="absolute inset-0 opacity-[0.22] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='f'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.2' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix values='0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.6 0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23f)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* ===== ETCHED GHOST BUTTERFLY ===== */}
      <div
        className="absolute inset-0 flex items-center justify-center"
        style={{
          transform: `translate3d(${mouse.x * 10}px, ${mouse.y * 10 + scrollY * 0.14}px, 0)`,
          transition: "transform 0.9s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
          backfaceVisibility: "hidden",
        }}
      >
        <img
          src="/ruby-diamond-32.svg"
          alt=""
          aria-hidden="true"
          className="select-none mix-blend-overlay"
          style={{
            width: "110vw",
            height: "110vw",
            maxWidth: "none",
            opacity: 0.30,
            filter: "saturate(1.8) contrast(1.3)",
            animation: "butterfly-drift 60s ease-in-out infinite reverse",
            willChange: "transform",
          }}
        />
      </div>

      {/* Aurora blob 1 — cyan top-left */}
      <div
        className="absolute -top-1/3 -left-1/4 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[100px] opacity-25 sm:opacity-35 animate-aurora"
        style={{
          background: "radial-gradient(circle, #00ffff 0%, transparent 70%)",
          transform: `translate3d(${mouse.x * 15}px, ${mouse.y * 15 + scrollY * 0.12}px, 0)`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      />

      {/* Aurora blob 2 — orange bottom-right */}
      <div
        className="absolute -bottom-1/3 -right-1/4 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full blur-[100px] opacity-20 sm:opacity-30 animate-aurora"
        style={{
          background: "radial-gradient(circle, #ff8c00 0%, transparent 70%)",
          animationDelay: "-7s",
          transform: `translate3d(${mouse.x * -15}px, ${mouse.y * -15 - scrollY * 0.08}px, 0)`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
          willChange: "transform",
        }}
      />

      {/* Aurora blob 3 — deep cyan accent */}
      <div
        className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[100px] opacity-15 sm:opacity-22 animate-aurora"
        style={{
          background: "radial-gradient(circle, #00a8a8 0%, transparent 70%)",
          animationDelay: "-14s",
          transform: `translate3d(${mouse.x * 10}px, ${mouse.y * 10 + scrollY * 0.06}px, 0)`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
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
          backgroundPosition: `0 ${-scrollY * 0.03}px`,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      {/* Fine noise texture */}
      <div
        className="absolute inset-0 opacity-[0.03] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      {/* Light vignette */}
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_60%,rgba(0,0,0,0.35)_100%)]" />
    </div>
  );
}