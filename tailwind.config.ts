import { type Config } from "tailwindcss";

export default {
  important: true,
  darkMode: "class",
  corePlugins: {
    preflight: false,
  },
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        print: ['Courier New', 'Courier', 'monospace']
      }
    },
  },
  plugins: [],
} satisfies Config;
