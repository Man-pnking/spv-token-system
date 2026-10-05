/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        holo: {
          cyan: "#00ffff",
          orange: "#ff8c00",
          white: "#ffffff",
          dark: "#00a8a8",
        },
        // Legacy aliases — anything still using `gold` classes keeps working
        // but now renders as cyan
        gold: {
          DEFAULT: "#00ffff",
          light: "#ff8c00",
          dark: "#00a8a8",
        },
        obsidian: "#0a0a0a",
        neutral: "#111111",
        warm: "#f0f0f0",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "gradient-shift": "gradient-shift 10s ease infinite",
        aurora: "aurora 22s ease infinite",
        "float-slow": "float 9s ease-in-out infinite",
        "float-medium": "float 7s ease-in-out infinite",
        "pulse-holo": "pulse-holo 3s ease-in-out infinite",
        "butterfly-drift": "butterfly-drift 45s ease-in-out infinite",
        "butterfly-drift-reverse": "butterfly-drift-reverse 60s ease-in-out infinite",
        "butterfly-spin": "butterfly-spin 90s linear infinite",
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
        "butterfly-drift": {
          "0%": { transform: "rotate(0deg) translate(0, 0) scale(1)" },
          "25%": { transform: "rotate(90deg) translate(20px, -20px) scale(1.03)" },
          "50%": { transform: "rotate(180deg) translate(0, -40px) scale(1.06)" },
          "75%": { transform: "rotate(270deg) translate(-20px, -20px) scale(1.03)" },
          "100%": { transform: "rotate(360deg) translate(0, 0) scale(1)" },
        },
        "butterfly-drift-reverse": {
          "0%": { transform: "rotate(360deg) translate(0, 0) scale(1)" },
          "25%": { transform: "rotate(270deg) translate(-30px, 15px) scale(1.04)" },
          "50%": { transform: "rotate(180deg) translate(0, 30px) scale(1.08)" },
          "75%": { transform: "rotate(90deg) translate(30px, 15px) scale(1.04)" },
          "100%": { transform: "rotate(0deg) translate(0, 0) scale(1)" },
        },
        "butterfly-spin": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};