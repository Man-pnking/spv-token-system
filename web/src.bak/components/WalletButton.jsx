import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Wallet, LogOut } from "lucide-react";
import { shorten } from "../utils/format";

export default function WalletButton({ compact = false, full = false }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  const handleClick = () => {
    if (isConnected) {
      disconnect();
    } else {
      open();
    }
  };

  if (isConnected) {
    return (
      <button
        onClick={handleClick}
        className={`btn-feedback glass-button text-sm flex items-center justify-center gap-2 ${full ? "w-full" : ""}`}
      >
        <LogOut className="w-4 h-4 text-[#d4af37]" />
        <span className="text-mono text-warm">
          {compact ? "Disconnect" : shorten(address)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      className={`btn-feedback btn-feedback-strong btn-gold text-sm flex items-center justify-center gap-2 ${full ? "w-full" : ""}`}
    >
      <Wallet className="w-4 h-4" />
      <span>Connect Wallet</span>
    </button>
  );
}