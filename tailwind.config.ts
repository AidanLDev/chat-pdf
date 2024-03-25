import { PluginAPI } from "tailwindcss/types/config";

/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "var(--background)",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
      },
      animation: {
        "fly-in-from-top": "flyInFromTop 1.5s ease-in-out",
        glow: "glow 2s ease-in-out infinite alternate",
        appear: "appear 1.5s ease-in-out forwards",
      },
      textStroke: {
        "3": "3px",
      },
      textStrokeColor: {
        black: "#000",
      },
    },
    keyframes: {
      flyInFromTop: {
        "0%": { transform: "translateY(-1000%)" },
        "80%": { transform: "translateY(5%)" },
        "100%": { transform: "translateY(0)" },
      },
      glow: {
        from: {
          textShadow:
            "0 0 2px #fff, 0 0 5px #fff, 0 0 7px var(--secondary), 0 0 5px var(--secondary), 0 0 12px var(--secondary), 0 0 15px var(--secondary), 0 0 17px var(--secondary)",
        },
        to: {
          textShadow:
            "0 0 5px #fff, 0 0 7px var(--outer-glow), 0 0 10px var(--outer-glow), 0 0 12px var(--outer-glow), 0 0 15px var(--outer-glow), 0 0 17px var(--outer-glow), 0 0 20px var(--outer-glow)",
        },
      },
      appear: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
    },
  },
  plugins: [
    "@tailwindcss/animations",
    function ({ addUtilities }: PluginAPI) {
      const newUtilities = {
        ".text-stroke": {
          "-webkit-text-stroke": "2px black",
          "text-stroke": "2px black",
        },
      };
      addUtilities(newUtilities);
    },
  ],
};
