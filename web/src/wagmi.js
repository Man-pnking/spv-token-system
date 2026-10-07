import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygon, polygonAmoy, mainnet } from "@reown/appkit/networks";
import { http, fallback } from "wagmi";

const projectId = "51cd3b45476208218ad7bf80015380d9";

const metadata = {
  name: "SPV Token",
  description: "Mint-on-demand bonding curve on Polygon",
  url: "https://spv-token-system-67jn.vercel.app",
  icons: ["https://spv-token-system-67jn.vercel.app/ruby-diamond-32.svg"],
  redirect: {
    native: "spvtoken://",
    universal: "https://spv-token-system-67jn.vercel.app",
    linkMode: true,
  },
};

const networks = [polygon, polygonAmoy, mainnet];

const transports = {
  [polygon.id]: fallback([
    http("https://polygon.drpc.org"),
    http("https://polygon.llamarpc.com"),
    http("https://rpc.ankr.com/polygon"),
  ]),
  [polygonAmoy.id]: fallback([
    http("https://rpc-amoy.polygon.technology"),
    http("https://polygon-amoy.drpc.org"),
  ]),
  [mainnet.id]: fallback([
    http("https://eth.llamarpc.com"),
    http("https://rpc.ankr.com/eth"),
  ]),
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
  allWallets: "ONLY_MOBILE",
  themeVariables: {
    "--w3m-accent": "#7c5cff",
    "--w3m-border-radius-master": "12px",
  },
});

export const config = wagmiAdapter.wagmiConfig;
