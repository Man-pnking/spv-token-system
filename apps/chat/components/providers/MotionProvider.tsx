"use client";

import { createContext, useContext, type ReactNode } from "react";
import { useReducedMotion } from "@/hooks/useReducedMotion";

type MotionContextValue = {
  reduced: boolean;
  allow: boolean;
};

const MotionContext = createContext<MotionContextValue>({
  reduced: false,
  allow: true,
});

export function MotionProvider({ children }: { children: ReactNode }) {
  const reduced = useReducedMotion();
  const value: MotionContextValue = { reduced, allow: !reduced };

  return <MotionContext.Provider value={value}>{children}</MotionContext.Provider>;
}

export function useMotion() {
  return useContext(MotionContext);
}
