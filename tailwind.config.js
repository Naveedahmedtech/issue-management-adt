/** @type {import('tailwindcss').Config} */
import type { Config } from 'tailwindcss';
import typography from '@tailwindcss/typography';

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
        textDark: "var(--color-text-dark)",
        hover: "var(--color-hover)",
        textHover: "var(--color-text-hover)",
        textSecondary: "var(--color-text-secondary)",
        border: "var(--color-border)",
        pending: "var(--color-pending)",
        success: "var(--color-success)",
        todo: "var(--color-todo)",
        error: "var(--color-error)",
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

  plugins: [typography],
};
