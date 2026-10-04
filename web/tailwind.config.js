/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        gold: {
          DEFAULT: "#d4af37",
          light: "#f4c430",
          dark: "#8a6f22",
        },
        obsidian: "#0a0705",
        warm: "#f5efe0",
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
        "pulse-gold": "pulse-gold 3s ease-in-out infinite",
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
        "pulse-gold": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(212, 175, 55, 0.35)" },
          "50%": { boxShadow: "0 0 60px rgba(212, 175, 55, 0.65)" },
        },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};