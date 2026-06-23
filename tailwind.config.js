/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#010828',
        cream: '#EFF4FF',
        neon: '#6FFF00'
      },
      fontFamily: {
        grotesk: ['"Space Grotesk"', 'sans-serif'],
        condiment: ['"Pacifico"', 'cursive'],
        mono: ['"Outfit"', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
