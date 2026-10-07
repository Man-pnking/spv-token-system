"use client";

import { useEffect, useRef } from "react";
import { useMessages } from "@/hooks/useMessages";
import { useTypingIndicator } from "@/hooks/useTypingIndicator";
import MessageBubble from "../MessageBubble";
import MessageComposer from "../MessageComposer";
import TypingIndicator from "../TypingIndicator";

export default function ChatDesktop({ conversationId, currentUserId, otherUser }) {
  const { messages, loading } = useMessages(conversationId);
  const { isOtherTyping, notifyTyping, notifyStopTyping } =
    useTypingIndicator(conversationId, currentUserId);
  const endRef = useRef(null);

  useEffect(() => {
    if (endRef.current) endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [messages.length, isOtherTyping]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center text-warm-mute text-sm">
        Loading messages...
      </div>
    );
  }

  return (
    <>
      <div className="flex-1 overflow-y-auto px-6 py-6">
        {messages.length === 0 ? (
          <div className="text-center text-warm-mute text-sm py-12">
            No messages yet. Say hi to @{otherUser.username}.
          </div>
        ) : (
          <div className="max-w-2xl mx-auto">
            {messages.map((m, i) => (
              <MessageBubble
                key={m.id}
                message={m}
                isMine={m.sender_id === currentUserId}
                showAvatar={i === 0 || messages[i - 1].sender_id !== m.sender_id}
              />
            ))}
          </div>
        )}

        {isOtherTyping && (
          <div className="flex justify-start max-w-2xl mx-auto">
            <TypingIndicator username={otherUser.username} />
          </div>
        )}

        <div ref={endRef} />
      </div>

      <MessageComposer
        conversationId={conversationId}
        onTyping={notifyTyping}
        onStopTyping={notifyStopTyping}
      />
    </>
  );
}
