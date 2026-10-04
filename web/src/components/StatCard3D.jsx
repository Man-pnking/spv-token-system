import { useRef, useState } from "react";

export default function StatCard3D({ icon: Icon, label, value, sub, accent }) {
  const ref = useRef(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0 });

  const handleMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width;
    const py = (e.clientY - rect.top) / rect.height;
    const rx = (0.5 - py) * 14;
    const ry = (px - 0.5) * 14;
    setTilt({ rx, ry });
  };

  const handleLeave = () => setTilt({ rx: 0, ry: 0 });

  return (
    <div className="perspective-1000">
      <div
        ref={ref}
        onMouseMove={handleMove}
        onMouseLeave={handleLeave}
        className="glass-strong rounded-2xl p-5 stat-3d cursor-default"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
        }}
      >
        <div className="stat-3d-inner">
          <div className="flex items-start justify-between mb-3">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center bg-white/5 border border-white/10 ${accent || ""}`}>
              <Icon className="w-5 h-5" />
            </div>
          </div>
          <div className="text-[10px] uppercase tracking-wider text-white/50 mb-1">{label}</div>
          <div className="text-2xl font-bold font-mono">{value}</div>
          {sub && <div className="text-xs text-white/50 mt-1">{sub}</div>}
        </div>
      </div>
    </div>
  );
}