"use client";

import Avatar from "./Avatar";

export default function MessageBubble({ message, isMine, showAvatar = true }) {
  const sender = message.sender || {};
  const time = new Date(message.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className={"flex gap-2 mb-4 " + (isMine ? "flex-row-reverse" : "flex-row")}>
      <div className="w-8 shrink-0">
        {showAvatar && !isMine && (
          <Avatar url={sender.avatar_url} username={sender.username} size={32} />
        )}
      </div>

      <div
        className={
          "max-w-[75%] flex flex-col " +
          (isMine ? "items-end" : "items-start")
        }
      >
        {!isMine && showAvatar && (
          <div className="text-[11px] text-warm-mute mb-1 px-1 font-medium">
            @{sender.username}
          </div>
        )}

        <div
          className={
            "px-4 py-2.5 text-sm whitespace-pre-wrap break-words " +
            (isMine
              ? "bg-[#00ffff] text-[#050510] font-medium rounded-2xl rounded-br-md"
              : "bg-white/10 text-warm border border-white/10 rounded-2xl rounded-bl-md")
          }
        >
          {message.content}
        </div>

        <div
          className={
            "text-[10px] text-warm-mute mt-1 px-1 " +
            (isMine ? "text-right" : "text-left")
          }
        >
          {time}
        </div>
      </div>
    </div>
  );
}
