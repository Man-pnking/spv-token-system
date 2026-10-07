"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import Avatar from "../Avatar";

type User = {
  id: string;
  username: string;
  avatar_url: string | null;
  bio?: string | null;
  created_at?: string;
};

type Props = {
  users: User[];
};

export function ExploreGrid({ users }: Props) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return users;
    return users.filter((u) => {
      const username = u.username?.toLowerCase() ?? "";
      const bio = u.bio?.toLowerCase() ?? "";
      return username.includes(q) || bio.includes(q);
    });
  }, [users, query]);

  return (
    <div>
      {/* Search bar */}
      <div className="sticky top-0 z-20 backdrop-blur-xl border-b border-white/5 px-4 py-3"
           style={{ background: "rgba(5, 5, 16, 0.85)" }}>
        <div className="relative max-w-2xl mx-auto">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mute pointer-events-none" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by username or bio"
            className="w-full bg-white/5 border border-white/10 rounded-full pl-10 pr-10 py-2.5 text-sm outline-none focus:border-[#00ffff]/40 focus:bg-white/[0.07] transition-colors placeholder:text-warm-mute"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              aria-label="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-white/10 transition-colors"
            >
              <X className="w-3.5 h-3.5 text-warm-mute" />
            </button>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className="px-4 py-5 max-w-5xl mx-auto">
        {filtered.length === 0 ? (
          <div className="text-center py-16 animate-fade-up">
            <div className="text-warm text-sm font-medium">
              {query ? "No users match your search" : "No users yet"}
            </div>
            <div className="text-warm-dim text-xs mt-1">
              {query ? "Try a different search" : "Invite someone to join"}
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {filtered.map((u, i) => (
              <Link
                key={u.id}
                href={`/profile/${u.username}`}
                className="group relative flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 transition-all duration-200 hover:bg-white/[0.05] hover:border-[#00ffff]/30 hover:-translate-y-0.5 hover:shadow-[0_8px_32px_rgba(0,255,255,0.08)] animate-fade-up"
                style={{ animationDelay: `${Math.min(i * 30, 300)}ms` }}
              >
                <div className="rounded-full p-1 transition-all duration-300 group-hover:ring-2 group-hover:ring-[#00ffff]/40 group-hover:ring-offset-2 group-hover:ring-offset-[#050510]">
                  <Avatar
                    url={u.avatar_url}
                    username={u.username}
                    size={64}
                  />
                </div>
                <div className="mt-3 w-full min-w-0">
                  <div className="text-warm text-sm font-semibold truncate">
                    @{u.username}
                  </div>
                  {u.bio ? (
                    <div className="text-warm-mute text-xs mt-1 line-clamp-2 min-h-[2rem]">
                      {u.bio}
                    </div>
                  ) : (
                    <div className="text-warm-mute/40 text-xs mt-1 italic min-h-[2rem]">
                      No bio
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        )}

        {filtered.length > 0 && (
          <div className="text-center text-[10px] text-warm-mute font-mono pt-6 uppercase tracking-wider">
            {filtered.length} {filtered.length === 1 ? "user" : "users"}
            {query && ` · matching "${query}"`}
          </div>
        )}
      </div>
    </div>
  );
}

export default ExploreGrid;
