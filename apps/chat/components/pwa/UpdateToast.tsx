"use client";

import { RefreshCw, X } from "lucide-react";
import { useState } from "react";
import { usePWA } from "./PWAProvider";

export function UpdateToast() {
  const { updateAvailable, applyUpdate } = usePWA();
  const [dismissed, setDismissed] = useState(false);

  if (!updateAvailable || dismissed) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 z-50 animate-fade-up"
    >
      <div className="glass-strong rounded-full pl-4 pr-2 py-2 flex items-center gap-3 border border-[#00ffff]/30 shadow-[0_8px_32px_rgba(0,255,255,0.15)]">
        <span className="text-xs text-warm">
          New version available
        </span>
        <button
          onClick={applyUpdate}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] text-xs font-semibold hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-shadow"
        >
          <RefreshCw className="w-3 h-3" />
          Reload
        </button>
        <button
          onClick={() => setDismissed(true)}
          aria-label="Dismiss"
          className="p-1.5 rounded-full text-warm-mute hover:text-warm hover:bg-white/5 transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
