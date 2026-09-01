/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: {
          DEFAULT: '#1E2027',
          soft: '#33353E',
        },
        brand: {
          red: '#E2231A',
          redDark: '#A8140F',
          gold: '#B8923A',
          goldSoft: '#D8BD7E',
        },
        paper: '#FFFFFF',
        offwhite: '#F7F7F5',
        line: 'rgba(30,32,39,0.12)',
      },
      fontFamily: {
        sans: ['Poppins', 'sans-serif'],
        brand: ['"Times New Roman"', 'Times', 'serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      borderRadius: {
        card: '14px',
      },
      boxShadow: {
        soft: '0 20px 40px -22px rgba(30,32,39,0.35)',
      },
    },
  },
  plugins: [],
};
