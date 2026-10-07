"use client";

import { WifiOff } from "lucide-react";
import { usePWA } from "./PWAProvider";

export function OfflineBanner() {
  const { isOnline } = usePWA();

  if (isOnline) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-0 left-0 right-0 z-[60] animate-fade-up"
    >
      <div className="bg-[#ff8c00]/15 border-b border-[#ff8c00]/30 backdrop-blur-md">
        <div className="flex items-center justify-center gap-2 px-4 py-1.5 text-xs text-[#ff8c00] font-mono">
          <WifiOff className="w-3 h-3" />
          <span>Offline — some features unavailable</span>
        </div>
      </div>
    </div>
  );
}
