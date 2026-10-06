// remove-wallet.mjs
// Removes wallet connect from SPV Chat.
// Run from apps/chat: node remove-wallet.mjs

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

function remove(relPath) {
  const full = path.join(__dirname, relPath);
  if (fs.existsSync(full)) {
    fs.unlinkSync(full);
    console.log(`  removed: ${relPath}`);
  } else {
    console.log(`  skip: ${relPath}`);
  }
}

console.log("Removing wallet connect...\n");

write("app/layout.jsx", `import "./globals.css";

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
      <body>{children}</body>
    </html>
  );
}
`);

write("app/page.jsx", `export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="max-w-xl w-full">
        <div className="text-label mb-4">SPV Chat</div>
        <h1 className="display-lg gradient-text mb-8">Welcome</h1>

        <div className="glass p-6">
          <div className="text-warm font-mono text-sm mb-2">Coming next</div>
          <ul className="text-warm-dim text-sm space-y-2">
            <li>· Sign in with wallet (identity only)</li>
            <li>· Public feed</li>
            <li>· Direct messages</li>
            <li>· SPV tips</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
`);

write("next.config.mjs", `/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
    ],
  },
};

export default nextConfig;
`);

remove("lib/wagmi.js");
remove("components/WalletProvider.jsx");
remove("components/WalletButton.jsx");
remove("lib/stubs/accounts.js");
remove("lib/stubs/empty.js");

try {
  fs.rmdirSync(path.join(__dirname, "lib/stubs"));
  console.log("  removed: lib/stubs/");
} catch {}

console.log("\nDone. Now run:\n");
console.log("  npm uninstall @reown/appkit @reown/appkit-adapter-wagmi wagmi viem @tanstack/react-query");
console.log("  taskkill //F //IM node.exe");
console.log("  rm -rf .next");
console.log("  npm run dev");
console.log("  rm remove-wallet.mjs");