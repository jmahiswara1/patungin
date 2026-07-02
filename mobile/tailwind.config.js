/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#0F1B2D",
          soft: "#1A2440",
          muted: "#4A5468",
          faint: "#8590A6",
        },
        paper: {
          DEFAULT: "#FFFFFF",
          soft: "#F4F6FB",
        },
        stroke: "#E2E5EE",
        blue: {
          DEFAULT: "#2F66F4",
          dark: "#1E4FD8",
          soft: "#E6EEFF",
        },
        green: {
          DEFAULT: "#22c55e",
        },
        red: {
          DEFAULT: "#ef4444",
        },
      },
      fontFamily: {
        body: ["Geist", "system-ui", "sans-serif"],
        display: ["Fraunces", "Georgia", "serif"],
        script: ["Caveat", "cursive"],
      },
    },
  },
  plugins: [],
};
