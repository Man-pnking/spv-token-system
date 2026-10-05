import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygon, polygonAmoy, mainnet } from "@reown/appkit/networks";

const projectId = import.meta.env.VITE_WC_PROJECT_ID || "demo-project-id";

const metadata = {
  name: "SPV Token",
  description: "Mint-on-demand bonding curve on Polygon",
  url: typeof window !== "undefined" ? window.location.origin : "https://spv.example",
  icons: ["https://avatars.githubusercontent.com/u/37784886"],
};

const networks = [polygon, polygonAmoy, mainnet];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
});

createAppKit({
  adapters: [wagmiAdapter],
  networks,
  projectId,
  metadata,
  features: { analytics: false, email: false, socials: false },
  themeMode: "dark",
  themeVariables: {
    "--w3m-accent": "#7c5cff",
    "--w3m-border-radius-master": "12px",
  },
});

export const config = wagmiAdapter.wagmiConfig;