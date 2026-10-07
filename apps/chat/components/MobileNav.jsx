"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Compass, MessageCircle, User } from "lucide-react";

const ITEMS = [
  { href: "/feed", label: "Feed", icon: Home },
  { href: "/explore", label: "Explore", icon: Compass },
  { href: "/chats", label: "Chats", icon: MessageCircle },
  { href: "/profile/me", label: "Profile", icon: User },
];

export default function MobileNav({ username }) {
  const pathname = usePathname();

  const items = ITEMS.map((item) => {
    if (item.href === "/profile/me") {
      return { ...item, href: "/profile/" + (username || "") };
    }
    return item;
  });

  return (
    <nav
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-white/5 backdrop-blur-xl"
      style={{
        background: "rgba(5, 5, 16, 0.92)",
        paddingBottom: "env(safe-area-inset-bottom, 0)",
      }}
    >
      <div className="flex items-center justify-around">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.href}
              href={item.href}
              className={
                "flex flex-col items-center gap-1 px-3 py-3 text-[10px] transition-colors " +
                (active ? "text-warm" : "text-warm-mute")
              }
            >
              <Icon className="w-5 h-5" />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
