/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f3f8',
          100: '#e8e2f0',
          200: '#d4c7e1',
          300: '#b8a5cc',
          400: '#9d82b5',
          500: '#8b6fa3',
          600: '#7a5d91',
          700: '#6a4d7f',
          800: '#5a3f6d',
          900: '#4a315b',
        },
        accent: {
          50: '#faf9f7',
          100: '#f3f1ed',
          200: '#e8e4dd',
          300: '#d9d3c8',
          400: '#c8bfae',
          500: '#b8ab94',
          600: '#a89a7f',
          700: '#8f8068',
          800: '#756855',
          900: '#5c5142',
        },
      },
    },
  },
  plugins: [],
}

