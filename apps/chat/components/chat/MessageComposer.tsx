"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "@/lib/messages";

type Props = {
  conversationId: string;
  onSent?: () => void;
  onTyping?: () => void;
  onStopTyping?: () => void;
};

export function MessageComposer({
  conversationId,
  onSent,
  onTyping,
  onStopTyping,
}: Props) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const [focused, setFocused] = useState(false);
  const stopTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setContent(value);

    if (value.trim() && onTyping) {
      onTyping();
      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => {
        onStopTyping?.();
      }, 3000);
    } else {
      onStopTyping?.();
    }
  };

  const handleSubmit = async (e?: React.FormEvent | React.KeyboardEvent) => {
    e?.preventDefault();
    const text = content.trim();
    if (!text || sending) return;

    setSending(true);
    const { error } = await sendMessage(conversationId, text);
    setSending(false);

    if (!error) {
      setContent("");
      onStopTyping?.();
      onSent?.();
    }
  };

  const canSend = content.trim().length > 0 && !sending;

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/5 bg-[#050510]/80 backdrop-blur-xl px-3 py-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-end gap-2 max-w-2xl mx-auto">
        <div
          className={
            "flex-1 rounded-bubble transition-all duration-200 " +
            "bg-white/[0.04] border " +
            (focused
              ? "border-[#00ffff]/40 shadow-[0_0_0_1px_rgba(0,255,255,0.15),0_0_20px_rgba(0,255,255,0.10)]"
              : "border-white/10")
          }
        >
          <textarea
            value={content}
            onChange={handleChange}
            onFocus={() => setFocused(true)}
            onBlur={() => {
              setFocused(false);
              onStopTyping?.();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            placeholder="Message…"
            rows={1}
            maxLength={2000}
            className="w-full bg-transparent px-4 py-2.5 text-sm outline-none resize-none max-h-32 placeholder:text-warm-mute"
          />
        </div>

        <button
          type="submit"
          disabled={!canSend}
          aria-label="Send message"
          className={
            "relative w-11 h-11 rounded-full flex items-center justify-center " +
            "transition-all duration-200 shrink-0 " +
            (canSend
              ? "bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] " +
                "shadow-[0_4px_20px_rgba(0,255,255,0.35)] " +
                "hover:shadow-[0_6px_28px_rgba(0,255,255,0.5)] hover:scale-105 " +
                "active:scale-95"
              : "bg-white/5 text-warm-mute cursor-not-allowed")
          }
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}

export default MessageComposer;
