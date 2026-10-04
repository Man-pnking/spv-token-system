import { useMousePosition } from "../hooks/useMousePosition";
import { useParallax } from "../hooks/useParallax";

export default function AnimatedBackground() {
  const mouse = useMousePosition();
  const scrollY = useParallax();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#0a0705] via-[#120d08] to-[#0a0705]" />

      <div
        className="absolute -top-1/3 -left-1/4 w-[70vw] h-[70vw] rounded-full blur-[120px] opacity-40 animate-aurora"
        style={{
          background: "radial-gradient(circle, #d4af37 0%, transparent 70%)",
          transform: `translate(${mouse.x * 30}px, ${mouse.y * 30 + scrollY * 0.15}px)`,
        }}
      />

      <div
        className="absolute -bottom-1/3 -right-1/4 w-[80vw] h-[80vw] rounded-full blur-[140px] opacity-30 animate-aurora"
        style={{
          background: "radial-gradient(circle, #f4c430 0%, transparent 70%)",
          animationDelay: "-7s",
          transform: `translate(${mouse.x * -40}px, ${mouse.y * -40 - scrollY * 0.1}px)`,
        }}
      />

      <div
        className="absolute top-1/3 right-1/4 w-[50vw] h-[50vw] rounded-full blur-[160px] opacity-20 animate-aurora"
        style={{
          background: "radial-gradient(circle, #7c5cff 0%, transparent 70%)",
          animationDelay: "-14s",
          transform: `translate(${mouse.x * 20}px, ${mouse.y * 20 + scrollY * 0.08}px)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(212,175,55,0.6) 1px, transparent 1px), linear-gradient(90deg, rgba(212,175,55,0.6) 1px, transparent 1px)",
          backgroundSize: "100px 100px",
          backgroundPosition: `0 ${-scrollY * 0.05}px`,
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.02] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(0,0,0,0.7)_100%)]" />
    </div>
  );
}