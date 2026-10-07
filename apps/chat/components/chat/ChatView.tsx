"use client";

import { useEffect, useRef } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import MessageBubble from "./MessageBubble";
import MessageComposer from "./MessageComposer";
import TypingIndicator from "./TypingIndicator";

type OtherUser = {
  id: string;
  username: string;
  avatar_url: string | null;
};

type Props = {
  conversationId: string;
  currentUserId: string;
  otherUser: OtherUser;
};

export function ChatView({ conversationId, currentUserId, otherUser }: Props) {
  const { messages: rawMessages, loading } = useMessages(conversationId);
  const { isOtherTyping, notifyTyping, notifyStopTyping } =
    useTypingIndicator(conversationId, currentUserId);
  const endRef = useRef<HTMLDivElement | null>(null);

  // Untyped hook — cast once here so every usage below is safe.
  const messages = (rawMessages ?? []) as Array<{
    id: string;
    content: string;
    image_url?: string | null;
    created_at: string;
    read_at?: string | null;
    sender_id: string;
    sender?: { id: string; username: string; avatar_url: string | null };
  }>;

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages.length, isOtherTyping]);

  if (loading) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center gap-3 text-warm-mute">
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
        <span className="text-xs font-mono">Loading messages</span>
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 min-h-0 overflow-y-auto px-3 md:px-6 py-4 md:py-6">
        <div className="max-w-2xl md:mx-auto">
          {messages.length === 0 ? (
            <div className="text-center py-16 animate-fade-up">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br from-[#00ffff]/20 to-[#ff8c00]/10 border border-[#00ffff]/20 flex items-center justify-center">
                <span className="text-2xl">👋</span>
              </div>
              <div className="text-warm text-sm font-medium">
                No messages yet
              </div>
              <div className="text-warm-mute text-xs mt-1">
                Say hi to @{otherUser.username}
              </div>
            </div>
          ) : (
            messages.map((m, i) => (
              <MessageBubble
                key={m.id}
                message={m}
                isMine={m.sender_id === currentUserId}
                showAvatar={
                  i === 0 || messages[i - 1].sender_id !== m.sender_id
                }
              />
            ))
          )}

          {isOtherTyping && <TypingIndicator username={otherUser.username} />}

          <div ref={endRef} />
        </div>
      </div>

      <MessageComposer
        conversationId={conversationId}
        onTyping={notifyTyping}
        onStopTyping={notifyStopTyping}
      />
    </>
  );
}

export default ChatView;
