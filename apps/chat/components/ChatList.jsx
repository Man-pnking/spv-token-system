"use client";

import Link from "next/link";
import Avatar from "./Avatar";
import { formatRelativeTime } from "@/lib/utils";

export default function ChatList({ conversations }) {
  if (!conversations || conversations.length === 0) {
    return (
      <div className="px-6 py-16 text-center text-warm-dim text-sm">
        No conversations yet. Start one from someone&apos;s profile.
      </div>
    );
  }

  return (
    <div>
      {conversations.map((c) => (
        <Link
          key={c.id}
          href={"/chats/" + c.id}
          className="flex items-center gap-3 px-4 py-4 border-b border-white/5 hover:bg-white/5 transition-colors"
        >
          <Avatar url={c.other?.avatar_url} username={c.other?.username} size={48} />
          <div className="flex-1 min-w-0">
            <div className="text-warm font-semibold truncate">
              @{c.other?.username}
            </div>
            <div className="text-warm-mute text-xs truncate">
              {formatRelativeTime(c.last_message_at)}
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
