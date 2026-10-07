"use client";

import { useState, useRef } from "react";
import { Send } from "lucide-react";
import { sendMessage } from "@/lib/messages";

export default function MessageComposer({ conversationId, onSent, onTyping, onStopTyping }) {
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const stopTimerRef = useRef(null);

  const handleChange = (e) => {
    const value = e.target.value;
    setContent(value);

    if (value.trim() && onTyping) {
      onTyping();

      if (stopTimerRef.current) clearTimeout(stopTimerRef.current);
      stopTimerRef.current = setTimeout(() => {
        if (onStopTyping) onStopTyping();
      }, 3000);
    } else if (onStopTyping) {
      onStopTyping();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = content.trim();
    if (!text || sending) return;

    setSending(true);
    const { error } = await sendMessage(conversationId, text);
    setSending(false);

    if (!error) {
      setContent("");
      if (onStopTyping) onStopTyping();
      if (onSent) onSent();
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="border-t border-white/5 bg-[#050510]/95 backdrop-blur px-3 py-3"
      style={{ paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)" }}
    >
      <div className="flex items-end gap-2 max-w-2xl mx-auto">
        <textarea
          value={content}
          onChange={handleChange}
          onBlur={() => {
            if (onStopTyping) onStopTyping();
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              handleSubmit(e);
            }
          }}
          placeholder="Message..."
          rows={1}
          maxLength={2000}
          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-2.5 text-sm outline-none focus:border-white/25 resize-none max-h-32"
        />
        <button
          type="submit"
          disabled={!content.trim() || sending}
          className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center disabled:opacity-30"
          aria-label="Send"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
