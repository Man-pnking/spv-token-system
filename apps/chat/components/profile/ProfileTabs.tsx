"use client";

import { useState } from "react";

const TABS = ["Posts", "Replies", "Likes"] as const;
type Tab = (typeof TABS)[number];

type Props = {
  onChange?: (tab: Tab) => void;
};

export function ProfileTabs({ onChange }: Props) {
  const [active, setActive] = useState<Tab>("Posts");

  const handle = (tab: Tab) => {
    setActive(tab);
    onChange?.(tab);
  };

  return (
    <div className="flex border-b border-[#00ffff]/10 relative">
      {TABS.map((tab) => {
        const isActive = active === tab;
        return (
          <button
            key={tab}
            onClick={() => handle(tab)}
            className={
              "flex-1 py-3.5 text-sm font-semibold transition-colors relative " +
              (isActive
                ? "text-warm"
                : "text-warm-mute hover:text-warm-dim")
            }
          >
            {tab}
            {isActive && (
              <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-14 h-0.5 rounded-full bg-gradient-to-r from-[#00ffff] to-[#ff8c00] shadow-[0_0_10px_rgba(0,255,255,0.5)]" />
            )}
          </button>
        );
      })}
    </div>
  );
}

export default ProfileTabs;
