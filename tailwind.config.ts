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

        // --- "Sanctuary Light" theme (homepage + shared chrome) ---
        sanctuary: {
          bg: "#eef2fb", // page background
          ink: "#0e1730", // headings / primary text
          muted: "#5c6a90", // body copy
          soft: "#8a93b0", // captions
          line: "#e0e7f4", // card borders
          line2: "#dce3f2", // section rules
          chip: "#eaf1fd", // date badge fill
          chipline: "#cfdcf5",
          link: "#1a5fd0",
          linkhover: "#1247a8",
          gold: "#b07d1e", // "listen" / prayer accent
          footer: "#e9eefa",
          sky: "#8fd0ff", // light-blue accent on the dark hero
        },
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
        // Body / UI type (Sanctuary Light uses Instrument Sans).
        sans: [
          "var(--font-instrument)",
          "Segoe UI",
          "system-ui",
          "-apple-system",
          "Roboto",
          "Helvetica",
          "Arial",
          "sans-serif",
        ],
        // Editorial headings (Sanctuary Light uses Newsreader).
        serif: ["var(--font-newsreader)", "Newsreader", "Georgia", "serif"],
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
        fadein: {
          from: { opacity: "0", transform: "translateY(8px)" },
          to: { opacity: "1", transform: "none" },
        },
      },
      animation: {
        floaty: "floaty 5s ease-in-out infinite",
        pop: "pop 0.3s ease",
        fadein: "fadein 0.7s ease both",
      },
    },
  },
  plugins: [],
};

export default config;
