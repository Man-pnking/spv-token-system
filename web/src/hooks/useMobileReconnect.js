import { useEffect } from "react";
import { useAccount, useReconnect } from "wagmi";

export function useMobileReconnect() {
  const { status } = useAccount();
  const { reconnect } = useReconnect();

  useEffect(() => {
    const tryReconnect = () => {
      if (status === "disconnected") reconnect();
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") tryReconnect();
    };

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("online", tryReconnect);
    window.addEventListener("focus", tryReconnect);

    return () => {
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("online", tryReconnect);
      window.removeEventListener("focus", tryReconnect);
    };
  }, [status, reconnect]);
}
