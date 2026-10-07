import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spv: { bg: "#050510", surface: "#0a0a14", surface2: "#111122", accent: "#00ffff", accent2: "#ff8c00", accent3: "#00a8a8" },
        warm: "#f0f0f0",
        obsidian: "#0a0a0a",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      borderRadius: { input: "12px", card: "16px", bubble: "20px" },
      spacing: { "18": "4.5rem", "88": "22rem", "104": "26rem", "120": "30rem" },
      boxShadow: {
        glow: "0 0 24px rgba(0, 255, 255, 0.25)",
        "glow-lg": "0 0 48px rgba(0, 255, 255, 0.35)",
        "glow-orange": "0 0 24px rgba(255, 140, 0, 0.25)",
        "inner-hair": "inset 0 1px 0 rgba(255, 255, 255, 0.08)",
      },
      backdropBlur: { xs: "2px" },
      keyframes: {
        "gradient-shift": { "0%, 100%": { backgroundPosition: "0% 50%" }, "50%": { backgroundPosition: "100% 50%" } },
        aurora: { "0%, 100%": { transform: "translate3d(-2%, -1%, 0) rotate(0deg)", opacity: "0.5" }, "50%": { transform: "translate3d(2%, 1%, 0) rotate(180deg)", opacity: "0.75" } },
        float: { "0%, 100%": { transform: "translateY(0px)" }, "50%": { transform: "translateY(-16px)" } },
        "pulse-holo": { "0%, 100%": { boxShadow: "0 0 24px rgba(0, 255, 255, 0.25)" }, "50%": { boxShadow: "0 0 48px rgba(0, 255, 255, 0.5)" } },
        "fade-up": { "0%": { opacity: "0", transform: "translateY(8px)" }, "100%": { opacity: "1", transform: "translateY(0)" } },
        "pop-in": { "0%": { opacity: "0", transform: "scale(0.92)" }, "100%": { opacity: "1", transform: "scale(1)" } },
        "typing-dot": { "0%, 60%, 100%": { transform: "translateY(0)", opacity: "0.4" }, "30%": { transform: "translateY(-4px)", opacity: "1" } },
        shimmer: { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
      },
      animation: {
        "gradient-shift": "gradient-shift 10s ease infinite",
        aurora: "aurora 24s ease-in-out infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "float-medium": "float 7s ease-in-out infinite",
        "pulse-holo": "pulse-holo 3s ease-in-out infinite",
        "fade-up": "fade-up 260ms cubic-bezier(0.22, 1, 0.36, 1)",
        "pop-in": "pop-in 220ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "typing-dot": "typing-dot 1.4s ease-in-out infinite",
        shimmer: "shimmer 3s linear infinite",
      },
    },
  },
  plugins: [],
};

export default config;
