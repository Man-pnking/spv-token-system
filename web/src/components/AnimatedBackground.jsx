import { useMousePosition } from "../hooks/useMousePosition";
import { useParallax } from "../hooks/useParallax";

export default function AnimatedBackground() {
  const mouse = useMousePosition();
  const scrollY = useParallax();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0a0a] via-[#111111] to-[#0a0a0a]" />

      <div
        className="absolute -top-1/3 -left-1/4 w-[70vw] h-[70vw] max-w-[600px] max-h-[600px] rounded-full blur-[120px] opacity-15 sm:opacity-25 animate-aurora"
        style={{
          background: "radial-gradient(circle, #00ffff 0%, transparent 70%)",
          transform: `translate(${mouse.x * 15}px, ${mouse.y * 15 + scrollY * 0.12}px)`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div
        className="absolute -bottom-1/3 -right-1/4 w-[80vw] h-[80vw] max-w-[700px] max-h-[700px] rounded-full blur-[140px] opacity-10 sm:opacity-20 animate-aurora"
        style={{
          background: "radial-gradient(circle, #ff8c00 0%, transparent 70%)",
          animationDelay: "-7s",
          transform: `translate(${mouse.x * -15}px, ${mouse.y * -15 - scrollY * 0.08}px)`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      <div
        className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] max-w-[500px] max-h-[500px] rounded-full blur-[160px] opacity-10 sm:opacity-15 animate-aurora"
        style={{
          background: "radial-gradient(circle, #00a8a8 0%, transparent 70%)",
          animationDelay: "-14s",
          transform: `translate(${mouse.x * 10}px, ${mouse.y * 10 + scrollY * 0.06}px)`,
          transition: "transform 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      />

      {/* Butterfly 1 — MAIN (desktop only) */}
      <div
        className="hidden md:flex absolute inset-0 items-center justify-center"
        style={{
          transform: `translate(${mouse.x * 8}px, ${mouse.y * 8 + scrollY * 0.15}px)`,
          transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <img
          src="/ruby-diamond-32.svg"
          alt=""
          aria-hidden="true"
          className="w-[min(90vw,1100px)] h-[min(90vw,1100px)] opacity-[0.045] mix-blend-screen select-none"
          style={{
            animation: "butterfly-drift 45s ease-in-out infinite",
            filter: "blur(0.5px) saturate(1.3)",
          }}
        />
      </div>

      {/* Butterfly 2 — ECHO (desktop only) */}
      <div
        className="hidden md:block absolute"
        style={{
          top: "15%",
          right: "-10%",
          width: "min(55vw, 700px)",
          height: "min(55vw, 700px)",
          transform: `translate(${mouse.x * -22}px, ${mouse.y * -22 + scrollY * 0.25}px)`,
          transition: "transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <img
          src="/ruby-diamond-32.svg"
          alt=""
          aria-hidden="true"
          className="w-full h-full opacity-[0.03] mix-blend-screen select-none"
          style={{
            animation: "butterfly-drift-reverse 60s ease-in-out infinite",
            filter: "blur(1.5px) hue-rotate(-30deg)",
          }}
        />
      </div>

      {/* Butterfly 3 — GHOST (desktop only) */}
      <div
        className="hidden md:block absolute"
        style={{
          top: "-8%",
          left: "-6%",
          width: "min(35vw, 450px)",
          height: "min(35vw, 450px)",
          transform: `translate(${mouse.x * 30}px, ${mouse.y * 30 - scrollY * 0.2}px)`,
          transition: "transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <img
          src="/ruby-diamond-32.svg"
          alt=""
          aria-hidden="true"
          className="w-full h-full opacity-[0.04] mix-blend-screen select-none"
          style={{
            animation: "butterfly-spin 90s linear infinite",
            filter: "blur(2px)",
          }}
        />
      </div>

      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(0,255,255,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(0,255,255,0.6) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          backgroundPosition: `0 ${-scrollY * 0.03}px`,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.025] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.55)_100%)]" />
    </div>
  );
}