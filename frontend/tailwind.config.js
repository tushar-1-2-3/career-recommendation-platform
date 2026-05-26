/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#1a1f2e',
        slate: '#2d3548',
        paper: '#f4f1eb',
        cream: '#ebe6dc',
        rust: '#b84a32',
        rustlight: '#d4654a',
        sage: '#4a6b5d',
        mist: '#8b93a7',
      },
      fontFamily: {
        display: ['"Fraunces"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        card: '0 1px 0 rgba(26,31,46,0.06), 0 4px 24px rgba(26,31,46,0.04)',
        lift: '0 8px 32px rgba(26,31,46,0.08)',
      },
    },
  },
  plugins: [],
};
