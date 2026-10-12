import { useEffect, useRef, useState } from "react";
import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Wallet, Smartphone, ExternalLink } from "lucide-react";
import { shorten } from "../utils/format";
import { useMetaMaskConnect } from "../hooks/useMetaMaskConnect";

const APP_HOST = "spv-token-system.vercel.app";
const METAMASK_DEEPLINK = `https://link.metamask.io/dapp/${APP_HOST}`;

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

function isInAppBrowser() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  // Facebook, Instagram, Twitter/X, Telegram, LinkedIn, TikTok, etc.
  return /FBAN|FBAV|Instagram|Twitter|Line|Telegram|LinkedIn|TikTok|Snapchat/i.test(ua);
}

export default function WalletButton({ compact = false }) {
  const { open } = useAppKit();
  const { connect } = useMetaMaskConnect();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();
  const wasConnected = useRef(false);
  const [showIosHelp, setShowIosHelp] = useState(false);

  useEffect(() => {
    if (isConnected && !wasConnected.current) {
      wasConnected.current = true;
      const el = document.getElementById("trade");
      if (el) {
        const top = el.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top, behavior: "smooth" });
      }
    }
    if (!isConnected) wasConnected.current = false;
  }, [isConnected]);

  const handleConnect = () => {
    connect();
    if (isIOS() && isInAppBrowser()) {
      setShowIosHelp(true);
    }
  };

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
    <>
      <button
        onClick={handleConnect}
        className="glow-btn text-white text-sm font-semibold rounded-full px-5 py-2.5 flex items-center gap-2"
      >
        <Wallet className="w-4 h-4" />
        <span>Connect</span>
      </button>

      {showIosHelp && (
        <div
          role="dialog"
          aria-label="iOS connection help"
          style={{
            position: "fixed", inset: 0, zIndex: 9999,
            background: "rgba(0,0,0,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setShowIosHelp(false)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: 400, width: "100%",
              background: "#0d0d18", border: "1px solid rgba(0,255,255,0.25)",
              borderRadius: 16, padding: 24, color: "#eaeaea",
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <Smartphone className="w-5 h-5" style={{ color: "#00ffff" }} />
              <strong>Open in MetaMask</strong>
            </div>
            <p style={{ fontSize: 14, lineHeight: 1.5, marginBottom: 16, color: "#a9a9b8" }}>
              iOS may block the automatic handoff. Tap below to open this site inside MetaMask's
              browser, then connect from there.
            </p>
            <a
              href={METAMASK_DEEPLINK}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                background: "linear-gradient(90deg,#00ffff,#ff8c00)",
                color: "#000", fontWeight: 700, padding: "12px 16px",
                borderRadius: 999, textDecoration: "none", marginBottom: 8,
              }}
            >
              Open MetaMask <ExternalLink className="w-4 h-4" />
            </a>
            <button
              onClick={() => setShowIosHelp(false)}
              style={{
                width: "100%", background: "transparent",
                color: "#a9a9b8", border: "1px solid rgba(255,255,255,0.15)",
                padding: "10px 16px", borderRadius: 999, cursor: "pointer",
              }}
            >
              Dismiss
            </button>
          </div>
        </div>
      )}
    </>
  );
}
