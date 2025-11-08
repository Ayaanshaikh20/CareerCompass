/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'var(--background-color)',
        secondaryBackground: 'var(--secondary-background-color)',
        buttonText: 'var(--button-text',
        surface: 'var(--surface-color)',
        textPrimary: 'var(--text-primary)',
        textSecondary: 'var(--text-secondary)',
        primary: 'var(--button-primary)',
        primaryHover: 'var(--hover-button-primary)',
        secondaryHover: 'var(--hover-button-secondary)',
        secondary: 'var(--button-secondary)',
        success: 'var(--success)',
        info: 'var(--info)',
        border: 'var(--border)',
      },
    },
  },
  plugins: [],
}