/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-brown': '#5a3d31',
        'brand-gold': '#c99b5a',
        'brand-dark': '#2A2320',
        'brand-light': '#F8F6F4',
        'brand-text': '#332D2B',
        'brand-muted': '#756E6A',
      },
    },
  },
  plugins: [],
}
