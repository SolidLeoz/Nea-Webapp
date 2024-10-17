/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'cream': '#f8e9d0',
        'navy': '#242549',
        'red': '#c3392a',
      },
    },
  },
  plugins: [],
}
