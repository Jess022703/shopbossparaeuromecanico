import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Porsche Guards Red
        guards: {
          DEFAULT: "#CC2229",
          dark: "#A11A20",
          light: "#E63B42",
        },
        // Warm gray secondary palette for the shop (industrial dark theme)
        shop: {
          950: "#0d0c0b",
          900: "#171513",
          800: "#211e1b",
          700: "#2d2a26",
          600: "#403b35",
          500: "#5c554d",
          400: "#8a8178",
          300: "#b3aaa0",
          200: "#d6cfc6",
          100: "#ece8e2",
        },
      },
      fontFamily: {
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
