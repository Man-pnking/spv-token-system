import { useMousePosition } from "../hooks/useMousePosition";

export default function AnimatedBackground() {
  const mouse = useMousePosition();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
      <div className="absolute inset-0 bg-gradient-to-br from-[#05060f] via-[#0a0a1f] to-[#05060f]" />

      <div
        className="absolute -top-1/3 -left-1/4 w-[60vw] h-[60vw] rounded-full blur-3xl opacity-30 animate-aurora"
        style={{
          background: "radial-gradient(circle, #7c5cff 0%, transparent 70%)",
          transform: `translate(${mouse.x * 30}px, ${mouse.y * 30}px)`,
        }}
      />

      <div
        className="absolute -bottom-1/3 -right-1/4 w-[70vw] h-[70vw] rounded-full blur-3xl opacity-25 animate-aurora"
        style={{
          background: "radial-gradient(circle, #00d4ff 0%, transparent 70%)",
          animationDelay: "-5s",
          transform: `translate(${mouse.x * -40}px, ${mouse.y * -40}px)`,
        }}
      />

      <div
        className="absolute top-1/3 right-1/3 w-[40vw] h-[40vw] rounded-full blur-3xl opacity-20 animate-aurora"
        style={{
          background: "radial-gradient(circle, #ffc857 0%, transparent 70%)",
          animationDelay: "-10s",
          transform: `translate(${mouse.x * 20}px, ${mouse.y * 20}px)`,
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
          backgroundSize: "80px 80px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)",
        }}
      />

      <div
        className="absolute inset-0 opacity-[0.015] mix-blend-overlay"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_40%,rgba(0,0,0,0.6)_100%)]" />
    </div>
  );
}