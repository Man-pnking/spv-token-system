"use client";

import { useEffect, useState, createContext, useContext } from "react";

type PWAContextValue = {
  updateAvailable: boolean;
  applyUpdate: () => void;
  installPromptAvailable: boolean;
  promptInstall: () => Promise<void>;
  isOnline: boolean;
};

const PWAContext = createContext<PWAContextValue>({
  updateAvailable: false,
  applyUpdate: () => {},
  installPromptAvailable: false,
  promptInstall: async () => {},
  isOnline: true,
});

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

export function PWAProvider({ children }: { children: React.ReactNode }) {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null);
  const [installEvent, setInstallEvent] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOnline, setIsOnline] = useState(true);

  // Register service worker
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!("serviceWorker" in navigator)) return;
    // Skip in dev — SW interferes with HMR
    if (window.location.hostname === "localhost" && window.location.port !== "3001") return;

    navigator.serviceWorker
      .register("/sw.js", { scope: "/" })
      .then((reg) => {
        setRegistration(reg);
        if (reg.waiting) setUpdateAvailable(true);
        reg.addEventListener("updatefound", () => {
          const newWorker = reg.installing;
          newWorker?.addEventListener("statechange", () => {
            if (newWorker.state === "installed" && navigator.serviceWorker.controller) {
              setUpdateAvailable(true);
            }
          });
        });
      })
      .catch((err) => console.warn("[PWA] SW registration failed:", err));

    // Detect new SW taking over (after skipWaiting)
    let refreshing = false;
    navigator.serviceWorker.addEventListener("controllerchange", () => {
      if (refreshing) return;
      refreshing = true;
      window.location.reload();
    });
  }, []);

  // Online / offline
  useEffect(() => {
    if (typeof window === "undefined") return;
    setIsOnline(navigator.onLine);
    const onOnline = () => setIsOnline(true);
    const onOffline = () => setIsOnline(false);
    window.addEventListener("online", onOnline);
    window.addEventListener("offline", onOffline);
    return () => {
      window.removeEventListener("online", onOnline);
      window.removeEventListener("offline", onOffline);
    };
  }, []);

  // Install prompt capture
  useEffect(() => {
    if (typeof window === "undefined") return;
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallEvent(e as BeforeInstallPromptEvent);
    };
    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const applyUpdate = () => {
    if (!registration?.waiting) return;
    registration.waiting.postMessage("SKIP_WAITING");
  };

  const promptInstall = async () => {
    if (!installEvent) return;
    await installEvent.prompt();
    const choice = await installEvent.userChoice;
    if (choice.outcome === "accepted") setInstallEvent(null);
  };

  return (
    <PWAContext.Provider
      value={{
        updateAvailable,
        applyUpdate,
        installPromptAvailable: !!installEvent,
        promptInstall,
        isOnline,
      }}
    >
      {children}
    </PWAContext.Provider>
  );
}

export function usePWA() {
  return useContext(PWAContext);
}
