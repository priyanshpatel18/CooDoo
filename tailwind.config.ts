import type { Config } from "tailwindcss";

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "var(--primary)",
          dark: "var(--primary-dark)",
        },
        background: {
          DEFAULT: "var(--background)",
          foreground: "var(--background-foreground)",
        },
        blueBackground: {
          DEFAULT: "var(--blueBackground)",
        },
        card: {
          DEFAULT: "var(--card)",
        },
        border: {
          DEFAULT: "var(--border)",
        },
        input: {
          DEFAULT: "var(--input)",
        },
        purpleBackground: {
          DEFAULT: "var(--purpleBackground)",
        },
        orangeBackground: {
          DEFAULT: "var(--orangeBackground)",
        },
        greenBackground: {
          DEFAULT: "var(--greenBackground)",
        },
        redBackground: {
          DEFAULT: "var(--redBackground)",
        },
        darkBlueBackground: {
          DEFAULT: "var(--darkBlueBackground)",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

export default config;
