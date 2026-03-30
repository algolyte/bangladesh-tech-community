import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#111827",
        mist: "#eef2ff",
        clay: "#f5efe6",
        ember: "#c2410c",
        pine: "#14532d"
      },
      fontFamily: {
        sans: ["Manrope", "Avenir Next", "Segoe UI", "sans-serif"],
        display: ["Space Grotesk", "Avenir Next", "Segoe UI", "sans-serif"]
      },
      boxShadow: {
        soft: "0 18px 60px rgba(17, 24, 39, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;
