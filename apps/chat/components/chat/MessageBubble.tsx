"use client";

import Avatar from "../Avatar";

type Sender = {
  id: string;
  username: string;
  avatar_url: string | null;
};

type Message = {
  id: string;
  content: string;
  image_url?: string | null;
  created_at: string;
  read_at?: string | null;
  sender_id: string;
  sender?: Sender;
};

type Props = {
  message: Message;
  isMine: boolean;
  showAvatar?: boolean;
};

function formatTime(date: string) {
  return new Date(date).toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
  });
}

export function MessageBubble({ message, isMine, showAvatar = true }: Props) {
  const sender = message.sender ?? ({} as Sender);
  const time = formatTime(message.created_at);
  const isRead = Boolean(message.read_at) && isMine;

  return (
    <div
      className={
        "flex gap-2 mb-3 animate-pop-in " +
        (isMine ? "flex-row-reverse" : "flex-row")
      }
    >
      {/* Avatar slot */}
      <div className="w-8 shrink-0">
        {showAvatar && !isMine && (
          <Avatar url={sender.avatar_url} username={sender.username} size={32} />
        )}
      </div>

      <div
        className={
          "max-w-[78%] md:max-w-[65%] flex flex-col " +
          (isMine ? "items-end" : "items-start")
        }
      >
        {/* Sender handle (only for other user, on first of a group) */}
        {!isMine && showAvatar && (
          <div className="text-[11px] text-warm-mute mb-1 px-1 font-medium">
            @{sender.username}
          </div>
        )}

        {/* Bubble */}
        <div
          className={
            "relative px-4 py-2.5 text-sm whitespace-pre-wrap break-words " +
            "rounded-bubble transition-all duration-200 " +
            (isMine
              ? "text-[#050510] font-medium bg-gradient-to-br from-[#00ffff] to-[#00c8c8] " +
                "rounded-br-md shadow-[0_4px_24px_rgba(0,255,255,0.18)] " +
                "hover:shadow-[0_6px_32px_rgba(0,255,255,0.32)] hover:-translate-y-px"
              : "text-warm bg-white/[0.06] border border-[#00ffff]/25 " +
                "rounded-bl-md backdrop-blur-sm " +
                "hover:border-[#00ffff]/50 hover:bg-white/[0.08] " +
                "hover:shadow-[0_0_24px_rgba(0,255,255,0.12)]")
          }
        >
          {message.content}

          {message.image_url && (
            <div className="-mx-1 mt-2 rounded-lg overflow-hidden border border-black/10">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={message.image_url}
                alt=""
                className="w-full h-auto max-w-xs"
              />
            </div>
          )}
        </div>

        {/* Timestamp + read */}
        <div
          className={
            "flex items-center gap-1.5 mt-1 px-1 text-[10px] " +
            "font-mono text-warm-mute " +
            (isMine ? "flex-row-reverse" : "flex-row")
          }
        >
          <span>{time}</span>
          {isRead && (
            <span
              className="text-[#00ffff]"
              aria-label="Read"
              title="Read"
            >
              ✓✓
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

export default MessageBubble;
