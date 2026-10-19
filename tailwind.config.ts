import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        cream: "#F2F0EB",
        ink: "#000000",
        charcoal: "#333333",
        sun: "#FFE03D",
        sky: "#4BB3D3",
        coral: "#FF4040",
      },
      fontFamily: {
        sans: ["var(--font-geist-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "ui-monospace", "monospace"],
      },
      boxShadow: {
        hard: "4px 4px 0 0 #000",
        card: "0 4px 14px rgba(0,0,0,.18)",
      },
    },
  },
  plugins: [],
};
export default config;
