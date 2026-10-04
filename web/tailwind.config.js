/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        spv: {
          bg: "#05060f",
          accent: "#7c5cff",
          accent2: "#00d4ff",
          gold: "#ffc857",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      animation: {
        "gradient-shift": "gradient-shift 12s ease infinite",
        "float-slow": "float 8s ease-in-out infinite",
        "float-medium": "float 6s ease-in-out infinite",
        "float-fast": "float 4s ease-in-out infinite",
        aurora: "aurora 20s ease infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
      },
      keyframes: {
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-30px)" },
        },
        aurora: {
          "0%, 100%": { transform: "translate(0, 0) rotate(0deg)", opacity: "0.4" },
          "50%": { transform: "translate(-8%, -6%) rotate(180deg)", opacity: "0.6" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 30px rgba(124, 92, 255, 0.4)" },
          "50%": { boxShadow: "0 0 60px rgba(124, 92, 255, 0.7)" },
        },
      },
      backdropBlur: { xs: "2px" },
    },
  },
  plugins: [],
};