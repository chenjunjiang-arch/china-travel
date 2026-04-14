import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1a1a2e",
        "rice-paper": "#f5f0e8",
        cinnabar: "#c53030",
        jade: "#2f855a",
        gold: "#d69e2e",
        porcelain: "#3182ce",
      },
      fontFamily: {
        chinese: ['"ZCOOL XiaoWei"', '"Noto Serif SC"', '"SimSun"', 'serif'],
      },
    },
  },
  plugins: [],
};

export default config;
