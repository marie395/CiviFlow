/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: "#1B2A4A",
          light: "#2C4370",
          dark: "#101B32",
        },
        fog: "#F1F3F2",
        slate: {
          DEFAULT: "#4A5568",
          light: "#7C8798",
        },
        amber: {
          DEFAULT: "#E29A3C",
          dark: "#B87A28",
        },
        teal: {
          DEFAULT: "#0F766E",
          dark: "#0B564F",
        },
        rust: {
          DEFAULT: "#B23A2E",
          dark: "#8C2C22",
        },
        parchment: "#FBFAF7",
      },
      fontFamily: {
        display: ["Fraunces", "Georgia", "serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
    },
  },
  plugins: [],
};