import "./globals.css";
import type { Metadata, Viewport } from "next";
import { AuthProvider } from "@/components/AuthProvider";
import { MotionProvider } from "@/components/providers/MotionProvider";
import { AuroraBackground } from "@/components/ui/AuroraBackground";
import { PWAProvider } from "@/components/pwa/PWAProvider";
import { UpdateToast } from "@/components/pwa/UpdateToast";
import { InstallPrompt } from "@/components/pwa/InstallPrompt";
import { OfflineBanner } from "@/components/pwa/OfflineBanner";

export const metadata: Metadata = {
  title: "SPV Chat",
  description: "Social feed and direct messaging for the SPV ecosystem",
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "SPV Chat",
  },
  icons: {
    icon: "/icon-192.png",
    apple: "/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#050510",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;700&family=Space+Grotesk:wght@500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <PWAProvider>
          <MotionProvider>
            <AuroraBackground />
            <OfflineBanner />
            <AuthProvider>{children}</AuthProvider>
            <UpdateToast />
            <InstallPrompt />
          </MotionProvider>
        </PWAProvider>
      </body>
    </html>
  );
}
