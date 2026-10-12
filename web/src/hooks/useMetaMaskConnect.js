import { useCallback } from "react";
import { useAppKit } from "@reown/appkit/react";

function isMobile() {
  if (typeof navigator === "undefined") return false;
  const ua = navigator.userAgent || "";
  const iOS = /iPad|iPhone|iPod/.test(ua)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
  const android = /Android/i.test(ua);
  return iOS || android;
}

let mmSdk = null;
async function getMetaMaskProvider() {
  if (mmSdk) return mmSdk.getProvider();
  const mod = await import("@metamask/sdk");
  const MetaMaskSDK = mod.default || mod.MetaMaskSDK;
  mmSdk = new MetaMaskSDK({
    dappMetadata: {
      name: "SPV Token",
      url: typeof window !== "undefined" ? window.location.origin : "https://spv-token-system.vercel.app",
      iconUrl: typeof window !== "undefined"
        ? window.location.origin + "/ruby-diamond-32.svg"
        : "https://spv-token-system.vercel.app/ruby-diamond-32.svg",
    },
    useDeeplink: true,
    checkInstallationImmediately: false,
    preferDesktop: false,
  });
  return mmSdk.getProvider();
}

export function useMetaMaskConnect() {
  const { open } = useAppKit();

  const connect = useCallback(async () => {
    if (typeof window === "undefined") return;

    if (isMobile()) {
      try {
        const provider = await getMetaMaskProvider();
        if (provider) {
          await provider.request({ method: "eth_requestAccounts", params: [] });
          return;
        }
      } catch (e) {
        console.warn("[MetaMask SDK] deeplink failed:", e?.message || e);
        // Fall through to the AppKit modal as a last resort
      }
    }

    // Desktop or SDK failure: show the AppKit modal
    try { open({ view: "Connect" }); } catch { try { open(); } catch {} }
  }, [open]);

  return { connect };
}
