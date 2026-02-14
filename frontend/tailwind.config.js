/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      sm: "425px",
      // => @media (min-width: 426px) { ... }
      md: "768px",
      // => @media (min-width: 768px) { ... }
      lg: "1024px",
      // => @media (min-width: 1025px) { ... }
      xl: "1440px",
      // => @media (min-width: 1440px) { ... }
      "2xl": "2560px",
      // => @media (min-width: 2560px) { ... }
    },
    extend: {
      colors: {
        background: "var(--background-color)",
        secondaryBackground: "var(--secondary-background-color)",
        darkBackground: "var(--dark-background-color)",
        buttonText: "var(--button-text",
        surface: "var(--surface-color)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        primary: "var(--button-primary)",
        primaryHover: "var(--hover-button-primary)",
        secondaryHover: "var(--hover-button-secondary)",
        secondary: "var(--button-secondary)",
        success: "var(--success)",
        info: "var(--info)",
        border: "var(--border)",
        danger: "var(--danger)",
      },
      fontFamily: {
        sans: "Inter, sans-serif",
      },
    },
  },
  plugins: [],
};
