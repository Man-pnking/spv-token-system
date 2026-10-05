"use client";

import { AuthProvider } from "@/hooks/useAuth";

export default function AuthGate({ children }) {
  return <AuthProvider>{children}</AuthProvider>;
}