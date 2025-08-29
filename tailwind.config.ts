import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/app/(frontend)/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/(frontend)/components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
export default config;
