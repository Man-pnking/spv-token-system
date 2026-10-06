import { useCallback, useState } from "react";
import { useAccount } from "wagmi";
import { CONFIG } from "../config";

const TOKEN_PARAMS = {
  address: CONFIG.spvToken,
  symbol: "SPV",
  decimals: 18,
  image: "https://spv-token-system-brxa.vercel.app/ruby-diamond-32.svg",
};

export function useAddToken() {
  const { isConnected } = useAccount();
  const [status, setStatus] = useState("idle");
  const [error, setError] = useState(null);

  const addToken = useCallback(async () => {
    if (!isConnected) {
      setError("Connect a wallet first");
      return false;
    }

    if (typeof window === "undefined" || !window.ethereum) {
      setError("No wallet detected in this browser");
      return false;
    }

    try {
      setStatus("pending");
      setError(null);

      const wasAdded = await window.ethereum.request({
        method: "wallet_watchAsset",
        params: {
          type: "ERC20",
          options: TOKEN_PARAMS,
        },
      });

      if (wasAdded) {
        setStatus("success");
        return true;
      } else {
        setStatus("declined");
        return false;
      }
    } catch (err) {
      setStatus("error");
      setError(err.message || "Failed to add token");
      return false;
    }
  }, [isConnected]);

  return {
    addToken,
    status,
    error,
    isSupported: typeof window !== "undefined" && !!window.ethereum,
  };
}
