import { useCallback, useRef } from "react";
import MetaMaskSDK from "@metamask/sdk";
import { useAccount, useConnect } from "wagmi";

let mmSdkInstance = null;

function getMMSDK() {
  if (mmSdkInstance) return mmSdkInstance;
  mmSdkInstance = new MetaMaskSDK({
    dappMetadata: {
      name: "SPV Token",
      url: typeof window !== "undefined" ? window.location.origin : "https://spv-token-system.vercel.app",
      iconUrl: typeof window !== "undefined"
        ? window.location.origin + "/ruby-diamond-32.svg"
        : "https://spv-token-system.vercel.app/ruby-diamond-32.svg",
    },
    // Do not auto-connect; we want the user to trigger it
    checkInstallationImmediately: false,
    // Prefer deeplink on mobile
    preferDesktop: false,
    useDeeplink: true,
  });
  return mmSdkInstance;
}

export function useMetaMaskConnect() {
  const { connectors } = useConnect();
  const firedRef = useRef(false);

  const connectWithMetaMask = useCallback(async () => {
    if (firedRef.current) return;
    firedRef.current = true;

    try {
      const sdk = getMMSDK();
      const provider = sdk.getProvider();

      if (!provider) {
        throw new Error("MetaMask provider unavailable");
      }

      // Trigger the connection. On mobile this deeplinks into MetaMask.
      const accounts = await provider.request({
        method: "eth_requestAccounts",
        params: [],
      });

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts returned from MetaMask");
      }

      // The SDK injects the provider; wagmi should detect it.
      // If wagmi does not auto-detect, fall through to allow the user
      // to reconnect from the MetaMask in-app browser.
      return accounts[0];
    } catch (err) {
      console.warn("MetaMask SDK connect failed:", err?.message || err);
      // Fallback: open MetaMask's in-app browser directly
      window.location.href =
        "https://link.metamask.io/dapp/spv-token-system.vercel.app";
      return null;
    } finally {
      firedRef.current = false;
    }
  }, []);

  return { connectWithMetaMask };
}
