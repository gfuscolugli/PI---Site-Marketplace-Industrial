/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'revalor-emerald': 'oklch(59.6% .145 163.225)',
      },
      fontFamily: {
        outfit: ['Outfit', 'sans-serif'],
      }
    },
  },
  plugins: [],
}