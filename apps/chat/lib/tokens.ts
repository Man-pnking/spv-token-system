/**
 * Design tokens — single source of truth for colors, spacing, radii,
 * motion timings, and breakpoints. Tailwind mirrors most of these;
 * this file is for cases where you need the raw value (canvas, SVG,
 * inline styles, JS logic).
 */

export const colors = {
  bg: "#050510",
  surface: "#0a0a14",
  surface2: "#111122",
  accent: "#00ffff",
  accent2: "#ff8c00",
  accent3: "#00a8a8",
  warm: "#f0f0f0",
  warmDim: "rgba(240, 240, 240, 0.6)",
  warmMute: "rgba(240, 240, 240, 0.35)",
  danger: "#ef4444",
} as const;

export const radii = { input: 12, card: 16, bubble: 20, pill: 9999 } as const;
export const spacing = { xs: 4, sm: 8, md: 12, lg: 16, xl: 24, "2xl": 32, "3xl": 48, "4xl": 64 } as const;
export const motion = {
  fast: 180,
  base: 260,
  slow: 400,
  ambient: 24000,
  spring: "cubic-bezier(0.34, 1.56, 0.64, 1)",
  easeOut: "cubic-bezier(0.22, 1, 0.36, 1)",
} as const;
export const breakpoints = { sm: 640, md: 768, lg: 1024, xl: 1280, "2xl": 1536 } as const;
export const zIndex = { base: 0, dropdown: 30, sticky: 20, overlay: 40, modal: 50, toast: 60 } as const;

export type Color = keyof typeof colors;
export type Radius = keyof typeof radii;
export type Spacing = keyof typeof spacing;
