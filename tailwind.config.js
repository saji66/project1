/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ['Playfair Display', 'serif'],
        body: ['Lato', 'sans-serif'],
      },
      colors: {
        cream: {
          50: '#fdfaf4',
          100: '#faf3e0',
          200: '#f5e6c2',
          300: '#edd9a3',
        },
        brown: {
          50: '#fdf8f5',
          100: '#f7ede3',
          200: '#e8cdb5',
          300: '#d4a574',
          400: '#c4855a',
          500: '#a8622e',
          600: '#8b4513',
          700: '#6b3410',
          800: '#4a240b',
          900: '#2d1607',
        },
        rose: {
          warm: '#e8826a',
        }
      },
    },
  },
  plugins: [],
};
