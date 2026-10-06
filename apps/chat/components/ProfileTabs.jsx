"use client";

import { useState } from "react";

const TABS = ["Posts", "Replies", "Likes"];

export default function ProfileTabs({ onChange }) {
  const [active, setActive] = useState("Posts");

  const handle = (tab) => {
    setActive(tab);
    if (onChange) onChange(tab);
  };

  return (
    <div className="flex border-b border-[#00ffff]/10 md:border-[#00ffff]/10">
      {TABS.map((tab) => (
        <button
          key={tab}
          onClick={() => handle(tab)}
          className={
            "flex-1 py-4 text-sm font-semibold transition-colors relative " +
            (active === tab ? "text-warm" : "text-warm-mute hover:text-warm-dim")
          }
        >
          {tab}
          {active === tab && (
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5 bg-gradient-to-r from-[#00ffff] to-[#ff8c00]" />
          )}
        </button>
      ))}
    </div>
  );
}
