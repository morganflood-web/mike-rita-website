import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Mike Rita brand palette — Warm & Earthy
        "brand-bg": "#1a0f0a",
        "brand-secondary": "#241408",
        "brand-accent": "#E8651A",
        "brand-text": "#F5F0E8",
        "brand-muted": "#B8A898",
        "brand-border": "#3a2010",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-playfair)", "Georgia", "serif"],
      },
    },
  },
  plugins: [],
};

export default config;
