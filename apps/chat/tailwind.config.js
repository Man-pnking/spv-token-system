/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
    "./hooks/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        spv: {
          bg: "#050510",
          surface: "#0a0a0a",
          surface2: "#111111",
          accent: "#00ffff",
          accent2: "#ff8c00",
          accent3: "#00a8a8",
        },
        // Legacy aliases so inherited parent classes work
        gold: {
          DEFAULT: "#00ffff",
          light: "#ff8c00",
          dark: "#00a8a8",
        },
        obsidian: "#0a0a0a",
        warm: "#f0f0f0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "gradient-shift": "gradient-shift 10s ease infinite",
        aurora: "aurora 22s ease infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "float-medium": "float 7s ease-in-out infinite",
        "pulse-holo": "pulse-holo 3s ease-in-out infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.35" },
          "50%": { transform: "translate(-6%, -4%) rotate(180deg)", opacity: "0.55" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-24px)" },
        },
        "pulse-holo": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(0, 255, 255, 0.35)" },
          "50%": { boxShadow: "0 0 60px rgba(0, 255, 255, 0.65)" },
        },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};
