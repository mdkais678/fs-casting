import type { Config } from "tailwindcss";
export default {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: { extend: {
    colors: { pearl: "#FAF9F6", gold: "#D6BD88", light: "#E8D9B5", ink: "#29251F", beige: "#F2EDE3" },
    fontFamily: { serif: ["var(--font-playfair)", "serif"], sans: ["var(--font-dm)", "sans-serif"] },
  } },
  plugins: [],
} satisfies Config;
