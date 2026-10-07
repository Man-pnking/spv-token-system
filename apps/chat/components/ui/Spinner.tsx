type Props = {
  label?: string;
  fullScreen?: boolean;
};

export function Spinner({ label = "Loading", fullScreen = false }: Props) {
  return (
    <div
      className={
        "flex flex-col items-center justify-center gap-3 " +
        (fullScreen ? "min-h-dvh" : "py-20")
      }
    >
      <div className="flex gap-1">
        <span
          className="w-2 h-2 rounded-full bg-[#00ffff] animate-typing-dot"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-[#00ffff] animate-typing-dot"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-2 h-2 rounded-full bg-[#00ffff] animate-typing-dot"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      {label && (
        <span className="text-xs font-mono text-warm-mute">{label}</span>
      )}
    </div>
  );
}

export default Spinner;
