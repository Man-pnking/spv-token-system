"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  MessageCircle,
  User,
  Search,
} from "lucide-react";
import Avatar from "../Avatar";

type Props = {
  username: string;
  avatarUrl?: string | null;
};

export function MobileTopBar({ username, avatarUrl }: Props) {
  return (
    <header
      className="md:hidden sticky top-0 z-30 border-b border-white/5 backdrop-blur-xl"
      style={{ background: "rgba(5, 5, 16, 0.85)" }}
    >
      <div className="flex items-center justify-between gap-3 px-4 py-3">
        <Link href="/feed" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] font-black text-[10px]">
            SPV
          </div>
        </Link>

        <Link
          href="/explore"
          aria-label="Search"
          className="flex-1 max-w-md flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-2 text-sm text-warm-mute"
        >
          <Search className="w-4 h-4" />
          <span>Search</span>
        </Link>

        <Link href={`/profile/${username}`} aria-label="Profile" className="shrink-0">
          <Avatar url={avatarUrl} username={username} size={32} />
        </Link>
      </div>
    </header>
  );
}

const NAV_ITEMS = [
  { href: "/feed", label: "Feed", icon: Home, match: (p: string) => p === "/feed" || p.startsWith("/post") },
  { href: "/explore", label: "Explore", icon: Compass, match: (p: string) => p.startsWith("/explore") },
  { href: "/chats", label: "Chats", icon: MessageCircle, match: (p: string) => p.startsWith("/chats") },
  { href: "/profile/me", label: "Profile", icon: User, match: (p: string) => p.startsWith("/profile") && !p.includes("/setup") },
];

export function MobileBottomNav({ username }: Props) {
  const pathname = usePathname();

  const items = NAV_ITEMS.map((item) =>
    item.href === "/profile/me"
      ? { ...item, href: `/profile/${username}` }
      : item
  );

  return (
    <nav
      aria-label="Primary mobile"
      className="md:hidden fixed bottom-3 left-3 right-3 z-40 rounded-2xl border border-white/10 backdrop-blur-2xl"
      style={{
        background: "rgba(5, 5, 16, 0.92)",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
        boxShadow:
          "0 12px 48px rgba(0, 0, 0, 0.45), inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      }}
    >
      <div className="flex items-center justify-around px-1 py-1.5">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.match(pathname);
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={
                "relative flex flex-col items-center gap-0.5 px-3 py-2 rounded-xl transition-all duration-200 " +
                (active
                  ? "text-[#00ffff] bg-white/5"
                  : "text-warm-mute hover:text-warm")
              }
            >
              <Icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
              {active && (
                <span className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-gradient-to-r from-[#00ffff] to-[#ff8c00] shadow-[0_0_12px_rgba(0,255,255,0.5)]" />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
