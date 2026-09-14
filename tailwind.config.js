/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0a0a0f',
        card: '#14121c',
        cardInner: '#120f19',
        accent: {
          purple: '#b026ff',
          magenta: '#ff2ec4',
          cyan: '#21e6e6',
        },
        text: {
          primary: '#f6f3f9',
          secondary: '#8b8399',
        },
      },
      fontFamily: {
        display: ['var(--font-unbounded)', 'sans-serif'],
        body: ['var(--font-manrope)', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
