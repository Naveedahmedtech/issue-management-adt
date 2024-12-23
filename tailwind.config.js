/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: "var(--color-primary)",
        background: "var(--color-background)",
        backgroundShade1: "var(--color-background-shade-1)",
        backgroundShade2: "var(--color-background-shade-2)",
        text: "var(--color-text)",
        hover: "var(--color-hover)",
        textHover: "var(--color-text-hover)",
        border: "var(--color-border)",
      },
    },
    keyframes: {
      progress: {
        "0%": { width: "0%" },
        "100%": { width: "100%" },
      },
    },
    animation: {
      "progress-running": "progress 5s linear forwards",
    },
  },

  plugins: [],
};
