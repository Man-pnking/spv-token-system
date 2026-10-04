import { useState, useRef, useEffect } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect, useBalance } from "wagmi";
import { Wallet, ChevronDown, Copy, ExternalLink, LogOut } from "lucide-react";
import { shorten } from "../utils/format";
import { CONFIG } from "../config";

export default function WalletButton({ compact = false }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const { data: polBalance } = useBalance({
    address,
    query: { enabled: !!address, refetchInterval: 15_000 },
  });

  const [menuOpen, setMenuOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const onClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  const copyAddress = () => {
    if (address) navigator.clipboard.writeText(address);
    setMenuOpen(false);
  };

  const viewOnExplorer = () => {
    if (address) {
      window.open(`${CONFIG.explorer}/address/${address}`, "_blank");
    }
    setMenuOpen(false);
  };

  const handleDisconnect = () => {
    disconnect();
    setMenuOpen(false);
  };

  if (!isConnected) {
    return (
      <button
        onClick={() => open()}
        className="btn-gold text-sm w-full sm:w-auto px-5 py-3 flex items-center justify-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect Wallet</span>
      </button>
    );
  }

  const polFormatted = polBalance ? Number(polBalance.formatted).toFixed(4) : "0.0000";

  return (
    <div className="relative w-full sm:w-auto" ref={ref}>
      <button
        onClick={() => setMenuOpen((v) => !v)}
        className="glass-button text-sm flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start"
      >
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-[#d4af37] animate-pulse" />
          <span className="hidden sm:inline font-mono text-warm">{shorten(address)}</span>
          <span className="sm:hidden text-warm">Connected</span>
        </span>
        <ChevronDown
          className={`w-3.5 h-3.5 text-warm-dim transition-transform ${menuOpen ? "rotate-180" : ""}`}
        />
      </button>

      {menuOpen && (
        <div className="absolute right-0 mt-2 w-64 frost-layer rounded-2xl border border-[#d4af37]/20 p-4 z-50">
          <div className="mb-4">
            <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-1">
              Connected
            </div>
            <div className="font-mono text-xs text-warm break-all">{address}</div>
          </div>

          <div className="mb-4 pb-4 border-b border-[#d4af37]/15">
            <div className="text-[10px] uppercase tracking-[0.25em] text-warm-mute mb-1">
              Balance
            </div>
            <div className="font-mono text-sm text-warm">{polFormatted} POL</div>
          </div>

          <div className="space-y-1">
            <button
              onClick={copyAddress}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-warm-dim hover:text-[#d4af37] transition-colors text-sm"
            >
              <Copy className="w-4 h-4" />
              Copy address
            </button>
            <button
              onClick={viewOnExplorer}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-white/5 text-warm-dim hover:text-[#d4af37] transition-colors text-sm"
            >
              <ExternalLink className="w-4 h-4" />
              View on Polygonscan
            </button>
            <button
              onClick={handleDisconnect}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-red-500/10 text-red-400 transition-colors text-sm"
            >
              <LogOut className="w-4 h-4" />
              Disconnect
            </button>
          </div>
        </div>
      )}
    </div>
  );
}