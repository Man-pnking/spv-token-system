"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, MessageCircle, User, Settings } from "lucide-react";

const ITEMS = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/chats", label: "Chats", icon: MessageCircle },
  { href: "/profile/me", label: "Profile", icon: User },
  { href: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ username }) {
  const pathname = usePathname();

  const items = ITEMS.map((item) => {
    if (item.href === "/profile/me") {
      return { ...item, href: "/profile/" + (username || "") };
    }
    return item;
  });

  return (
    <aside className="hidden md:flex md:flex-col md:w-56 lg:w-64 border-r border-white/5 px-4 py-6 gap-1">
      {items.map((item) => {
        const Icon = item.icon;
        const active =
          pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex items-center gap-3 px-4 py-3 rounded-xl text-sm transition-colors " +
              (active
                ? "bg-white/10 text-warm"
                : "text-warm-dim hover:text-warm hover:bg-white/5")
            }
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{item.label}</span>
          </Link>
        );
      })}
    </aside>
  );
}
