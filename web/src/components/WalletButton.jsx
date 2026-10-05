import { useEffect, useRef } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Wallet } from "lucide-react";
import { shorten } from "../utils/format";

export default function WalletButton({ compact = false }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const wasConnected = useRef(false);

  useEffect(() => {
    if (isConnected && !wasConnected.current) {
      wasConnected.current = true;
      const el = document.getElementById("trade");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
    if (!isConnected) {
      wasConnected.current = false;
    }
  }, [isConnected]);

  if (isConnected) {
    return (
      <button
        onClick={() => disconnect()}
        className="glass-button text-sm flex items-center gap-2"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span>Disconnect</span>
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="glow-btn text-white text-sm font-semibold rounded-full px-5 py-2.5 flex items-center gap-2"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect</span>
    </button>
  );
}