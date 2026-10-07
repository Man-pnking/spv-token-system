export default function AppLoading() {
  return (
    <div className="flex-1 flex items-center justify-center py-20 animate-fade-up">
      <div className="flex flex-col items-center gap-3">
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
        <span className="text-xs font-mono text-warm-mute">Loading</span>
      </div>
    </div>
  );
}
