"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Search, Plus } from "lucide-react";
import Avatar from "../Avatar";
import { formatRelativeTime } from "@/lib/utils";

type Conversation = {
  id: string;
  last_message_at: string | null;
  other: { id: string; username: string; avatar_url: string | null } | null;
};

type Props = {
  conversations: Conversation[];
};

export function ConversationsPanel({ conversations }: Props) {
  const pathname = usePathname();
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return conversations;
    return conversations.filter((c) =>
      c.other?.username?.toLowerCase().includes(q)
    );
  }, [conversations, query]);

  return (
    <aside
      aria-label="Conversations"
      className="hidden md:flex md:flex-col w-[280px] shrink-0 border-r border-white/5 bg-black/10 backdrop-blur-xl"
    >
      {/* Header */}
      <div className="h-16 flex items-center justify-between px-4 border-b border-white/5">
        <h2 className="text-warm font-bold text-sm tracking-wide">Messages</h2>
        <Link
          href="/chats/new"
          aria-label="New chat"
          className="w-8 h-8 rounded-lg flex items-center justify-center text-warm-mute hover:text-warm hover:bg-white/5 transition-colors"
        >
          <Plus className="w-4 h-4" />
        </Link>
      </div>

      {/* Search */}
      <div className="p-3 border-b border-white/5">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mute pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search"
            className="w-full bg-white/5 border border-white/10 rounded-input pl-9 pr-3 py-2 text-sm outline-none focus:border-white/25 transition-colors placeholder:text-warm-mute"
          />
        </div>
      </div>

      {/* List */}
      <nav className="flex-1 overflow-y-auto">
        {filtered.length === 0 ? (
          <div className="px-4 py-12 text-center text-warm-mute text-xs">
            {query ? "No matches" : "No conversations yet"}
          </div>
        ) : (
          <ul>
            {filtered.map((c) => {
              const active = pathname === `/chats/${c.id}`;
              return (
                <li key={c.id}>
                  <Link
                    href={`/chats/${c.id}`}
                    className={
                      "flex items-center gap-3 px-3 py-3 mx-2 rounded-xl transition-colors " +
                      (active
                        ? "bg-white/10 text-warm"
                        : "text-warm-dim hover:bg-white/5 hover:text-warm")
                    }
                  >
                    <div className="relative shrink-0">
                      <Avatar
                        url={c.other?.avatar_url}
                        username={c.other?.username}
                        size={40}
                      />
                      {active && (
                        <span className="absolute -inset-0.5 rounded-full ring-2 ring-[#00ffff]/40" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm font-semibold truncate">
                          @{c.other?.username ?? "unknown"}
                        </span>
                        {c.last_message_at && (
                          <span className="text-[10px] text-warm-mute shrink-0 font-mono">
                            {formatRelativeTime(c.last_message_at)}
                          </span>
                        )}
                      </div>
                    </div>
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </nav>
    </aside>
  );
}
