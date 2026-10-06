"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LogOut, User, Settings } from "lucide-react";
import { signOut } from "@/lib/auth";
import Avatar from "./Avatar";

export default function TopBar({ username, avatarUrl }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  };

  return (
    <header
      className="sticky top-0 z-30 border-b border-[#00ffff]/10 backdrop-blur-xl"
      style={{ background: "rgba(5, 5, 16, 0.92)" }}
    >
      <div className="flex items-center justify-between px-4 py-3">
        <Link href="/feed" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] font-black text-xs">
            SPV
          </div>
          <span className="text-warm font-bold text-sm hidden sm:block">SPV Chat</span>
        </Link>

        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setOpen((v) => !v)}
            className="flex items-center gap-2 rounded-full hover:bg-white/5 p-1 transition-colors"
          >
            <Avatar url={avatarUrl} username={username} size={32} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-56 glass-strong rounded-xl overflow-hidden">
              <div className="px-4 py-3 border-b border-[#00ffff]/10">
                <div className="text-warm text-sm font-mono truncate">@{username}</div>
              </div>
              <Link
                href={"/profile/" + username}
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-warm-dim hover:text-warm hover:bg-white/5"
              >
                <User className="w-4 h-4" /> Profile
              </Link>
              <Link
                href="/settings"
                onClick={() => setOpen(false)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-warm-dim hover:text-warm hover:bg-white/5"
              >
                <Settings className="w-4 h-4" /> Settings
              </Link>
              <button
                onClick={handleSignOut}
                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-400 hover:bg-red-500/10 border-t border-[#00ffff]/10"
              >
                <LogOut className="w-4 h-4" /> Sign out
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
