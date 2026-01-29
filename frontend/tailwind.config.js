import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        montserrat: ['Montserrat', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        brand: {
          primary: '#C05800', // Rust Orange (Buttons)
          bg: '#FFF8F0',      // Floral White (Neutral Background)
          cream: '#FDFBD4',   // Original Cream (For Landing Pages)
          secondary: '#713600', // Brown (Highlights)
          dark: '#38240D',    // Dark Brown (Text/Footer)
        }
      },
    },
  },
  plugins: [],
}

