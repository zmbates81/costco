/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'costco-red': '#E31837',
        'costco-blue': '#0073CF',
        'costco-blue-dark': '#005A9C',
      },
    },
  },
  plugins: [],
}
