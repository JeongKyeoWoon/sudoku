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
        gray: {
          primary: "#505050",
        },
      },
      backgroundColor: {
        default: "#212121",
      },
      borderColor: {
        default: "#505050",
      },
    },
  },
  plugins: [],
};
export default config;
