"use client";

type Props = {
  username: string;
};

export function TypingIndicator({ username }: Props) {
  return (
    <div className="flex items-center gap-2 px-2 py-2 animate-fade-up">
      <div className="flex items-center gap-1 px-3 py-2 rounded-bubble rounded-bl-md bg-white/[0.06] border border-[#00ffff]/25 backdrop-blur-sm">
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-typing-dot"
          style={{ animationDelay: "0ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-typing-dot"
          style={{ animationDelay: "150ms" }}
        />
        <span
          className="w-1.5 h-1.5 rounded-full bg-[#00ffff] animate-typing-dot"
          style={{ animationDelay: "300ms" }}
        />
      </div>
      <span className="text-xs text-warm-mute font-mono">
        @{username} is typing
      </span>
    </div>
  );
}

export default TypingIndicator;
