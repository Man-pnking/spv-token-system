import { useCallback } from "react";
import { useAppKit } from "@reown/appkit/react";

const DEEP_LINK = "https://link.metamask.io/dapp/spv-token-system.vercel.app";

function isIOS() {
  if (typeof navigator === "undefined") return false;
  return /iPad|iPhone|iPod/.test(navigator.userAgent)
    || (navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1);
}

export function useMetaMaskConnect() {
  const { open } = useAppKit();

  const connect = useCallback(() => {
    if (typeof window === "undefined") return;
    if (isIOS()) {
      window.location.href = DEEP_LINK;
      return;
    }
    try {
      open();
    } catch (e) {
      window.location.href = DEEP_LINK;
    }
  }, [open]);

  return { connect, isIOS: isIOS() };
}
