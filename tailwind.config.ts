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
        // ── Warm food-appropriate palette ──────────────────────────────────
        primary: {
          DEFAULT: "#E8872B", // Saffron Orange
          50:  "#fef7ee",
          100: "#fdecd7",
          200: "#fbd5ae",
          300: "#f8b878",
          400: "#f49040",
          500: "#E8872B", // base
          600: "#d96d18",
          700: "#b55413",
          800: "#904317",
          900: "#743918",
          950: "#3f1b09",
        },
        secondary: {
          DEFAULT: "#C0543A", // Terracotta Red
          50:  "#fdf4f1",
          100: "#fbe7e1",
          200: "#f7d0c6",
          300: "#f1ae9e",
          400: "#e77f68",
          500: "#d9593c",
          600: "#C0543A", // base
          700: "#a03429",
          800: "#852e25",
          900: "#6e2a23",
          950: "#3c130f",
        },
        accent: {
          DEFAULT: "#4A7C59", // Herb Green
          50:  "#f1f8f4",
          100: "#dcefdf",
          200: "#bcdfc3",
          300: "#8dc69c",
          400: "#5da975",
          500: "#3d8d5a",
          600: "#4A7C59", // base
          700: "#2a5c3e",
          800: "#244a34",
          900: "#1e3d2c",
          950: "#0f2119",
        },
        neutral: {
          DEFAULT: "#F5F0E8", // Warm Stone
          50:  "#fdfcfa",
          100: "#F5F0E8", // base
          200: "#ede5d4",
          300: "#ddd3bb",
          400: "#c9ba9a",
          500: "#b5a07d",
          600: "#9d8764",
          700: "#836e4f",
          800: "#6c5a42",
          900: "#594b38",
          950: "#2f271d",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        display: ["var(--font-playfair)", "Georgia", "serif"],
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideInLeft: {
          "0%": { opacity: "0", transform: "translateX(-24px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        rotateSlow: {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-in-left": "slideInLeft 0.6s ease-out forwards",
        float: "float 3s ease-in-out infinite",
        "rotate-slow": "rotateSlow 20s linear infinite",
        "scale-in": "scaleIn 0.4s ease-out forwards",
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #1a0e05 0%, #2d1810 40%, #1e1208 100%)",
        "card-gradient": "linear-gradient(145deg, rgba(232,135,43,0.05) 0%, rgba(192,84,58,0.05) 100%)",
      },
      boxShadow: {
        "card": "0 4px 24px rgba(0,0,0,0.08), 0 1px 4px rgba(0,0,0,0.04)",
        "card-hover": "0 12px 40px rgba(232,135,43,0.15), 0 4px 12px rgba(0,0,0,0.08)",
        "glow-primary": "0 0 32px rgba(232,135,43,0.25)",
        "inner-top": "inset 0 2px 8px rgba(0,0,0,0.06)",
      },
    },
  },
  plugins: [],
};

export default config;
