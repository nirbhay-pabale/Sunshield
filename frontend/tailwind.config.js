/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          dark: '#143d2b',
          primary: '#236c43',
          light: '#2e7d32',
          surface: '#f4f7f4',
          card: '#ffffff',
          border: '#e1ece2',
          subtle: '#658172',
          pill: '#e9f5ed'
        },
        risk: {
          low: '#2e7d32',
          moderate: '#eab308',
          high: '#ea580c',
          veryhigh: '#ef4444',
          extreme: '#991b1b'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['"Space Grotesk"', 'sans-serif'],
        grotesk: ['"Space Grotesk"', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 4px 0 rgba(0, 0, 0, 0.04), 0 1px 2px 0 rgba(0, 0, 0, 0.02)',
        'card-hover': '0 4px 12px 0 rgba(0, 0, 0, 0.07)',
      }
    },
  },
  plugins: [],
}
