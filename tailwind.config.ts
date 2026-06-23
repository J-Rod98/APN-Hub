import type { Config } from "tailwindcss";

/**
 * APN Hub design tokens.
 * The whole brand (dark navy + electric blue glow) lives here, so re-theming
 * is a one-file change. Components reference these semantic color names.
 */
const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Backgrounds (deepest -> raised)
        navy: {
          950: "#05070f", // deepest black-navy
          900: "#0a0f1f", // page background
          850: "#0f1730", // card background
          800: "#16213f", // raised / hover
        },
        line: "#1e2c52", // borders
        ink: {
          DEFAULT: "#eef3ff", // primary text
          muted: "#9aa9cf", // secondary text
        },
        brand: {
          DEFAULT: "#2f8bff", // electric blue
          bright: "#4fc3ff", // glow accent
          deep: "#1452d6", // gradient end
        },
        gold: "#ffcd6b", // premium accent (reserved for future APN+)
        success: "#46d39a",
        danger: "#ff6b6b",
      },
      boxShadow: {
        glow: "0 8px 24px rgba(47,139,255,0.35)",
        "glow-lg":
          "0 0 0 1px rgba(79,195,255,0.12), 0 18px 50px rgba(20,82,214,0.28)",
      },
      borderRadius: {
        xl2: "18px",
      },
      fontFamily: {
        sans: [
          "var(--font-inter)",
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
      },
      keyframes: {
        floaty: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" },
        },
        pop: {
          from: { transform: "scale(0.97)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        pop: "pop 0.3s ease",
      },
    },
  },
  plugins: [],
};

export default config;
