"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Bell, MessageCircle } from "lucide-react";

const ITEMS = [
  { href: "/feed", label: "Home", icon: Home },
  { href: "/notifications", label: "Notifications", icon: Bell },
  { href: "/chats", label: "Messages", icon: MessageCircle },
];

export default function DesktopTopNav() {
  const pathname = usePathname();

  return (
    <nav className="hidden md:flex items-center justify-center gap-1 border-b border-[#00ffff]/10 px-4">
      {ITEMS.map((item) => {
        const Icon = item.icon;
        const active = pathname === item.href || pathname.startsWith(item.href + "/");
        return (
          <Link
            key={item.href}
            href={item.href}
            className={
              "flex items-center gap-2 px-5 py-4 text-sm font-semibold transition-colors relative " +
              (active ? "text-warm" : "text-warm-mute hover:text-warm-dim")
            }
          >
            <Icon className="w-5 h-5" />
            <span>{item.label}</span>
            {active && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-16 h-0.5 bg-gradient-to-r from-[#00ffff] to-[#ff8c00]" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
