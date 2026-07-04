/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        cream: "#FFF6F0",
        sakura: { DEFAULT: "#FFB6C8", light: "#FFE1E9", dark: "#FF8FAB" },
        "rose-gold": { DEFAULT: "#D9A299", dark: "#B97D71" },
        plum: { DEFAULT: "#241726", light: "#3A2640", deep: "#150C19" },
        lavender: "#C9B6E4",
        "baby-blue": "#AEDFF7",
        gold: "#D4AF6A",
      },
      fontFamily: {
        display: ["var(--font-fraunces)", "serif"],
        body: ["var(--font-manrope)", "sans-serif"],
        hand: ["var(--font-caveat)", "cursive"],
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "50%": { transform: "translateY(-18px) rotate(3deg)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        sparkle: {
          "0%, 100%": { opacity: "0.2", transform: "scale(0.8)" },
          "50%": { opacity: "1", transform: "scale(1.2)" },
        },
        "pulse-glow": {
          "0%, 100%": { boxShadow: "0 0 20px rgba(255,182,200,0.4)" },
          "50%": { boxShadow: "0 0 40px rgba(255,182,200,0.8)" },
        },
        "bob-walk": {
          "0%, 100%": { transform: "translateY(0) rotate(-2deg)" },
          "50%": { transform: "translateY(-4px) rotate(2deg)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 8s ease-in-out infinite",
        sparkle: "sparkle 2.4s ease-in-out infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "bob-walk": "bob-walk 0.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
