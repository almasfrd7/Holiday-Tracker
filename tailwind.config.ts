import type { Config } from "tailwindcss";
// Tell Tailwind which files to scan for class names
const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {} },
  plugins: [],
};
export default config;
