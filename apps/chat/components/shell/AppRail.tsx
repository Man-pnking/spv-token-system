"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  MessageCircle,
  User,
  Settings,
} from "lucide-react";
import Avatar from "../Avatar";

type RailItem = {
  href: string;
  label: string;
  icon: typeof Home;
  match?: (pathname: string) => boolean;
};

type Props = {
  username: string;
  avatarUrl?: string | null;
};

export function AppRail({ username, avatarUrl }: Props) {
  const pathname = usePathname();

  const items: RailItem[] = [
    {
      href: "/feed",
      label: "Feed",
      icon: Home,
      match: (p) => p === "/feed" || p.startsWith("/post"),
    },
    { href: "/explore", label: "Explore", icon: Compass },
    {
      href: "/chats",
      label: "Chats",
      icon: MessageCircle,
      match: (p) => p.startsWith("/chats"),
    },
    {
      href: `/profile/${username}`,
      label: "Profile",
      icon: User,
      match: (p) => p.startsWith("/profile") && !p.includes("/setup"),
    },
  ];

  return (
    <aside
      aria-label="Primary"
      className="hidden md:flex md:flex-col md:w-16 shrink-0 border-r border-white/5 bg-black/20 backdrop-blur-xl"
    >
      {/* Brand */}
      <Link
        href="/feed"
        className="h-16 flex items-center justify-center border-b border-white/5 group"
        aria-label="SPV Chat home"
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] font-black text-[11px] transition-transform group-hover:scale-105 group-active:scale-95">
          SPV
        </div>
      </Link>

      {/* Primary nav */}
      <nav className="flex-1 flex flex-col items-center gap-1 py-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = item.match
            ? item.match(pathname)
            : pathname === item.href || pathname.startsWith(item.href + "/");

          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              aria-current={active ? "page" : undefined}
              className={
                "relative group w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-200 " +
                (active
                  ? "bg-white/10 text-[#00ffff] shadow-[0_0_20px_rgba(0,255,255,0.15)]"
                  : "text-warm-mute hover:text-warm hover:bg-white/5")
              }
            >
              <Icon className="w-5 h-5" />
              {/* Tooltip */}
              <span className="pointer-events-none absolute left-full ml-3 px-2.5 py-1 rounded-md text-xs font-medium bg-black/90 border border-white/10 text-warm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity">
                {item.label}
              </span>
              {/* Active indicator */}
              {active && (
                <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-6 rounded-r bg-gradient-to-b from-[#00ffff] to-[#ff8c00]" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: settings + avatar */}
      <div className="flex flex-col items-center gap-2 py-4 border-t border-white/5">
        <Link
          href="/settings"
          aria-label="Settings"
          className={
            "w-11 h-11 rounded-xl flex items-center justify-center transition-all " +
            (pathname.startsWith("/settings")
              ? "bg-white/10 text-[#00ffff]"
              : "text-warm-mute hover:text-warm hover:bg-white/5")
          }
        >
          <Settings className="w-5 h-5" />
        </Link>
        <Link
          href={`/profile/${username}`}
          aria-label="Your profile"
          className="w-11 h-11 rounded-xl flex items-center justify-center hover:bg-white/5 transition-colors"
        >
          <Avatar url={avatarUrl} username={username} size={28} />
        </Link>
      </div>
    </aside>
  );
}
