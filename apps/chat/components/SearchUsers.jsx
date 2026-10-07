"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Search, X } from "lucide-react";
import { searchUsers } from "@/lib/search";
import Avatar from "./Avatar";

export default function SearchUsers() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  useEffect(() => {
    if (query.trim().length < 1) {
      setResults([]);
      setLoading(false);
      return;
    }

    let cancelled = false;
    setLoading(true);

    const t = setTimeout(async () => {
      const { users } = await searchUsers(query);
      if (!cancelled) {
        setResults(users);
        setLoading(false);
        setOpen(true);
      }
    }, 250);

    return () => {
      cancelled = true;
      clearTimeout(t);
    };
  }, [query]);

  const clear = () => {
    setQuery("");
    setResults([]);
    setOpen(false);
  };

  return (
    <div ref={containerRef} className="relative flex-1 max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-warm-mute pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query && setOpen(true)}
          placeholder="Search users"
          className="w-full bg-white/5 border border-white/10 rounded-full pl-9 pr-9 py-2 text-sm outline-none focus:border-white/25 transition-colors placeholder:text-warm-mute"
        />
        {query && (
          <button
            onClick={clear}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-full hover:bg-white/10"
            aria-label="Clear search"
          >
            <X className="w-3.5 h-3.5 text-warm-mute" />
          </button>
        )}
      </div>

      {open && (
        <div className="absolute left-0 right-0 top-full mt-2 glass-strong rounded-xl overflow-hidden z-50">
          {loading ? (
            <div className="px-4 py-6 text-center text-warm-mute text-sm">
              Searching...
            </div>
          ) : results.length === 0 ? (
            <div className="px-4 py-6 text-center text-warm-mute text-sm">
              No users found
            </div>
          ) : (
            <div>
              {results.map((u) => (
                <Link
                  key={u.id}
                  href={"/profile/" + u.username}
                  onClick={clear}
                  className="flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                >
                  <Avatar url={u.avatar_url} username={u.username} size={36} />
                  <div className="flex-1 min-w-0">
                    <div className="text-warm text-sm font-semibold truncate">
                      @{u.username}
                    </div>
                    {u.bio && (
                      <div className="text-warm-mute text-xs truncate">
                        {u.bio}
                      </div>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
