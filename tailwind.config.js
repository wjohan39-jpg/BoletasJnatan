/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx}', './components/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#05070d',
        card: '#0d131f',
        cardInner: '#0a0f18',
        // Token names (purple/magenta/cyan) predate this palette — they now
        // hold a deep-to-bright blue ramp (black/blue/white brief) instead
        // of the original violet/magenta/cyan triad. Kept as-is rather than
        // renamed across every component to keep this a low-risk swap.
        accent: {
          purple: '#0b3cff',
          magenta: '#2f7cff',
          cyan: '#6fd8ff',
        },
        text: {
          primary: '#f4f7fc',
          secondary: '#8b93a6',
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
