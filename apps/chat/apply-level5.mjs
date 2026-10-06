// apply-level5.mjs
// Writes all Level 5 files in one run.
// Run from apps/chat: node apply-level5.mjs

import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function write(relPath, content) {
  const full = path.join(__dirname, relPath);
  const dir = path.dirname(full);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(full, content, "utf8");
  console.log(`  wrote: ${relPath}`);
}

console.log("Applying Level 5 files...\n");

write("next.config.mjs", `import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");

    config.resolve.alias = {
      ...config.resolve.alias,
      accounts: path.resolve(__dirname, "lib/stubs/accounts.js"),
      "@x402/evm/upto/client": path.resolve(__dirname, "lib/stubs/empty.js"),
      "@x402/evm/exact/client": path.resolve(__dirname, "lib/stubs/empty.js"),
      "@x402/evm": path.resolve(__dirname, "lib/stubs/empty.js"),
      "@x402/core": path.resolve(__dirname, "lib/stubs/empty.js"),
    };

    return config;
  },
};

export default nextConfig;
`);

write("lib/stubs/accounts.js", `// Stub for wagmi's optional \`accounts\` peer dependency.
// Only needed by the Tempo and WebAuthn connectors, which we don't use.
module.exports = {};
`);

write("lib/stubs/empty.js", `// Generic stub for optional peer dependencies we don't use.
export default {};
export const x402Client = {};
export const ExactEvmScheme = {};
export const UptoEvmScheme = {};
`);

write("lib/wagmi.js", `import { createAppKit } from "@reown/appkit/react";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { polygon, polygonAmoy, mainnet } from "@reown/appkit/networks";

const projectId = process.env.NEXT_PUBLIC_WC_PROJECT_ID;

if (!projectId) {
  console.warn("NEXT_PUBLIC_WC_PROJECT_ID is missing — WalletConnect will not work");
}

const metadata = {
  name: "SPV Chat",
  description: "Social feed and direct messaging for the SPV ecosystem",
  url: typeof window !== "undefined" ? window.location.origin : "https://spv.chat",
  icons: ["https://spv-token-system-brxa.vercel.app/ruby-diamond-32.svg"],
};

const networks = [polygon, polygonAmoy, mainnet];

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId: projectId || "missing",
  ssr: true,
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
    "--w3m-accent": "#00ffff",
    "--w3m-border-radius-master": "12px",
  },
});

export const wagmiConfig = wagmiAdapter.wagmiConfig;
`);

write("lib/utils.js", `import clsx from "clsx";

export function shorten(address, chars = 4) {
  if (!address) return "";
  return \`\${address.slice(0, 2 + chars)}...\${address.slice(-chars)}\`;
}

export function cn(...args) {
  return clsx(...args);
}

export function formatRelativeTime(date) {
  if (!date) return "";
  const now = Date.now();
  const then = new Date(date).getTime();
  const diff = Math.floor((now - then) / 1000);

  if (diff < 60) return "just now";
  if (diff < 3600) return \`\${Math.floor(diff / 60)}m\`;
  if (diff < 86400) return \`\${Math.floor(diff / 3600)}h\`;
  if (diff < 604800) return \`\${Math.floor(diff / 86400)}d\`;
  return new Date(date).toLocaleDateString();
}
`);

write("components/WalletProvider.jsx", `"use client";

import { useState } from "react";
import { WagmiProvider } from "wagmi";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { wagmiConfig } from "@/lib/wagmi";

export default function WalletProvider({ children }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 10_000, refetchOnWindowFocus: false },
        },
      })
  );

  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </WagmiProvider>
  );
}
`);

write("components/WalletButton.jsx", `"use client";

import { useAppKit } from "@reown/appkit/react";
import { useAccount, useDisconnect } from "wagmi";
import { Wallet } from "lucide-react";
import { shorten } from "@/lib/utils";

export default function WalletButton({ compact = false }) {
  const { open } = useAppKit();
  const { address, isConnected } = useAccount();
  const { disconnect } = useDisconnect();

  if (isConnected && address) {
    return (
      <button
        onClick={() => disconnect()}
        className="glass-button text-sm flex items-center gap-2"
        aria-label="Disconnect wallet"
      >
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className={compact ? "" : "hidden sm:inline"}>
          {compact ? "Connected" : shorten(address)}
        </span>
      </button>
    );
  }

  return (
    <button
      onClick={() => open()}
      className="btn-gold text-sm font-semibold inline-flex items-center gap-2"
      aria-label="Connect wallet"
    >
      <Wallet className="w-4 h-4" />
      <span>Connect</span>
    </button>
  );
}
`);

write("app/layout.jsx", `import "./globals.css";
import WalletProvider from "@/components/WalletProvider";

export const metadata = {
  title: "SPV Chat",
  description: "Social feed and direct messaging for the SPV ecosystem",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <WalletProvider>{children}</WalletProvider>
      </body>
    </html>
  );
}
`);

write("app/page.jsx", `"use client";

import { useAccount } from "wagmi";
import WalletButton from "@/components/WalletButton";
import { config } from "@/lib/config";

export default function Home() {
  const { address, isConnected } = useAccount();

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="text-label mb-4">Level 5 · Wallet Connect</div>
        <h1 className="display-lg gradient-text mb-8">SPV Chat</h1>

        <div className="glass p-6 mb-6">
          <div className="text-label mb-4">Wallet Status</div>
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className={\`w-2 h-2 rounded-full \${
                  isConnected ? "bg-green-400 animate-pulse" : "bg-warm-mute"
                }\`}
              />
              <span className="text-warm font-mono text-sm">
                {isConnected ? "Connected" : "Not connected"}
              </span>
            </div>
            <WalletButton />
          </div>
          {isConnected && address && (
            <div className="mt-4 text-mono text-xs text-warm-dim break-all">
              {address}
            </div>
          )}
        </div>

        <div className="text-label mb-2">Chain</div>
        <div className="text-mono text-xs text-warm-dim space-y-1">
          <div>Chain ID: {config.chainId}</div>
          <div>Network: {config.chainName}</div>
        </div>
      </div>
    </div>
  );
}
`);

console.log("\nDone. 9 files written.");
console.log("\nNext:");
console.log("  1. taskkill //F //IM node.exe");
console.log("  2. rm -rf .next");
console.log("  3. npm run dev");
console.log("  4. Open http://localhost:3001");
console.log("  5. Delete this script: rm apply-level5.mjs");