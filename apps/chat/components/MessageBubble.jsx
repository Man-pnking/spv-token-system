"use client";

import Avatar from "./Avatar";

export default function MessageBubble({ message, isMine, showAvatar = true }) {
  const sender = message.sender || {};
  const time = new Date(message.created_at).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });

  return (
    <div className={"flex gap-2 mb-3 " + (isMine ? "flex-row-reverse" : "flex-row")}>
      <div className="w-8 shrink-0">
        {showAvatar && !isMine && (
          <Avatar url={sender.avatar_url} username={sender.username} size={32} />
        )}
      </div>

      <div className={"max-w-[70%] flex flex-col " + (isMine ? "items-end" : "items-start")}>
        <div
          className={
            "px-3.5 py-2 rounded-2xl text-sm whitespace-pre-wrap break-words " +
            (isMine
              ? "bg-white text-black rounded-br-sm"
              : "bg-white/8 text-warm rounded-bl-sm")
          }
        >
          {message.content}
        </div>
        <div className="text-[10px] text-warm-mute mt-1 px-1">{time}</div>
      </div>
    </div>
  );
}
