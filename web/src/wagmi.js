import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygon, polygonAmoy, mainnet } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_WC_PROJECT_ID;

if (!projectId) {
  console.warn("VITE_WC_PROJECT_ID is missing - WalletConnect will not work");
}

const metadata = {
  name: "SPV Token",
  description: "Mint-on-demand bonding curve on Polygon",
  url: "https://spv-token-system-brxa.vercel.app",
  icons: ["https://spv-token-system-brxa.vercel.app/ruby-diamond-32.svg"],
};

const networks = [polygon, polygonAmoy, mainnet];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId || "missing",
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId: projectId || "missing",
  metadata,
  features: {
    analytics: false,
    email: false,
    socials: false,
  },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#7c5cff",
    "--w3m-border-radius-master": "12px",
  },
});

export const config = wagmiAdapter.wagmiConfig;
