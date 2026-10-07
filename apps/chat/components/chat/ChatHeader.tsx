"use client";

import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Phone, Video } from "lucide-react";
import Avatar from "../Avatar";

type Props = {
  username: string;
  avatarUrl: string | null;
};

export function ChatHeader({ username, avatarUrl }: Props) {
  return (
    <header
      className="sticky top-0 z-20 border-b border-white/5 backdrop-blur-xl flex items-center gap-3 px-3 md:px-5 py-3"
      style={{ background: "rgba(5, 5, 16, 0.85)" }}
    >
      {/* Back (mobile only) */}
      <Link
        href="/chats"
        aria-label="Back"
        className="md:hidden p-2 rounded-full hover:bg-white/5 transition-colors shrink-0"
      >
        <ArrowLeft className="w-5 h-5 text-warm" />
      </Link>

      {/* User info */}
      <Link
        href={`/profile/${username}`}
        className="flex items-center gap-3 flex-1 min-w-0 group"
      >
        <div className="relative shrink-0">
          <Avatar url={avatarUrl} username={username} size={36} />
          <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full bg-[#00ffff] border-2 border-[#050510]" />
        </div>
        <div className="min-w-0">
          <div className="text-warm font-semibold text-sm truncate group-hover:text-[#00ffff] transition-colors">
            @{username}
          </div>
          <div className="text-[10px] text-warm-mute font-mono">online</div>
        </div>
      </Link>

      {/* Actions */}
      <div className="flex items-center gap-1 shrink-0">
        <button
          type="button"
          aria-label="Voice call"
          className="p-2 rounded-full text-warm-mute hover:text-warm hover:bg-white/5 transition-colors"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="Video call"
          className="p-2 rounded-full text-warm-mute hover:text-warm hover:bg-white/5 transition-colors"
        >
          <Video className="w-4 h-4" />
        </button>
        <button
          type="button"
          aria-label="More"
          className="p-2 rounded-full text-warm-mute hover:text-warm hover:bg-white/5 transition-colors"
        >
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
}

export default ChatHeader;
