export default function SectionLabel({ current, total = 9, title }) {
  const pad = (n) => String(n).padStart(2, "0");

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute">
        {title}
      </div>
      <div className="text-[10px] uppercase tracking-[0.3em] text-warm-mute font-mono">
        <span className="text-[#d4af37]">{pad(current)}</span>
        <span className="mx-1 opacity-40">/</span>
        <span className="opacity-60">{pad(total)}</span>
      </div>
    </div>
  );
}