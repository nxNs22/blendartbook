/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          50: '#F1FDFF',
          100: '#E3FBFE',
          200: '#C9F5FC',
          300: '#A6EBF8',
          400: '#82DFF3',
          500: '#6FD8F0',
          600: '#5BCDE9',
          700: '#38B2D0',
          800: '#2D99B5',
          900: '#1F6F84',
        },
        teal: {
          50: '#F1FDFF',
          100: '#E3FBFE',
          200: '#C9F5FC',
          300: '#A6EBF8',
          400: '#82DFF3',
          500: '#6FD8F0',
          600: '#5BCDE9',
          700: '#38B2D0',
          800: '#2D99B5',
          900: '#1F6F84',
        },
      },
    },
  },
  plugins: [],
};