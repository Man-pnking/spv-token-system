import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygon, polygonAmoy, mainnet } from "@reown/appkit/networks";
import { http } from "wagmi";

const projectId = "51cd3b45476208218ad7bf80015380d9";

const metadata = {
  name: "SPV Token",
  description: "Mint-on-demand bonding curve on Polygon",
  url: "https://spv-token-system-brxa.vercel.app",
  icons: ["https://spv-token-system-brxa.vercel.app/ruby-diamond-32.svg"],
  redirect: {
    native: "spvtoken://",
    universal: "https://spv-token-system-brxa.vercel.app",
    linkMode: true,
  },
};

const networks = [polygon, polygonAmoy, mainnet];

const transports = {
  [polygon.id]: http("https://polygon-rpc.com"),
  [polygonAmoy.id]: http("https://rpc-amoy.polygon.technology"),
  [mainnet.id]: http("https://eth.llamarpc.com"),
};

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
  ssr: false,
  transports,
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
