"use client";

import { useIsMobile } from "@/hooks/useIsMobile";

export default function LayoutSwitch({ mobile, desktop }) {
  const isMobile = useIsMobile();
  return isMobile ? mobile : desktop;
}
