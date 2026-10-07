"use client";

import { Download, X } from "lucide-react";
import { useEffect, useState } from "react";
import { usePWA } from "./PWAProvider";

const DISMISS_KEY = "spv:install-dismissed";

export function InstallPrompt() {
  const { installPromptAvailable, promptInstall } = usePWA();
  const [dismissed, setDismissed] = useState(true); // start hidden to avoid flash

  useEffect(() => {
    setDismissed(localStorage.getItem(DISMISS_KEY) === "1");
  }, []);

  if (!installPromptAvailable || dismissed) return null;

  const dismiss = () => {
    localStorage.setItem(DISMISS_KEY, "1");
    setDismissed(true);
  };

  return (
    <div
      role="region"
      aria-label="Install app"
      className="fixed bottom-24 md:bottom-6 left-3 right-3 md:left-auto md:right-6 md:w-80 z-40 animate-fade-up"
    >
      <div className="glass-strong rounded-2xl p-4 border border-[#00ffff]/20 shadow-[0_12px_48px_rgba(0,0,0,0.5)]">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] font-black text-xs shrink-0">
            SPV
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-warm font-semibold text-sm">
              Install SPV Chat
            </div>
            <div className="text-warm-mute text-xs mt-0.5">
              Faster, offline-ready, home screen.
            </div>
            <div className="flex items-center gap-2 mt-3">
              <button
                onClick={promptInstall}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-gradient-to-br from-[#00ffff] to-[#00a8a8] text-[#050510] text-xs font-semibold hover:shadow-[0_0_20px_rgba(0,255,255,0.4)] transition-shadow"
              >
                <Download className="w-3 h-3" />
                Install
              </button>
              <button
                onClick={dismiss}
                className="text-xs text-warm-mute hover:text-warm transition-colors px-2 py-1.5"
              >
                Not now
              </button>
            </div>
          </div>
          <button
            onClick={dismiss}
            aria-label="Dismiss"
            className="p-1.5 rounded-full text-warm-mute hover:text-warm hover:bg-white/5 transition-colors shrink-0"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
