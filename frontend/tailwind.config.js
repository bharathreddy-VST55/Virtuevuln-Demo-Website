/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'demon-slayer': {
          'dark': '#0B0B0C',
          'dark-secondary': '#1A1A1C',
          'border': '#D1D1D3',
          'sky-blue': '#87CEEB',
          'sky-blue-dark': '#5F9EA0',
          'sky-blue-darker': '#4682B4',
        },
      },
      backgroundImage: {
        'anime-gradient': 'linear-gradient(135deg, #87CEEB 0%, #5F9EA0 50%, #4682B4 100%)',
        'dark-gradient': 'linear-gradient(135deg, #1A1A1C 0%, #0B0B0C 100%)',
      },
    },
  },
  plugins: [],
}

