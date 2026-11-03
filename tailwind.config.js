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
          50: '#f0f5fa',
          100: '#e1ecf5',
          200: '#c3d9eb',
          300: '#95bedc',
          400: '#619ecb',
          500: '#3d83b9',
          600: '#2b699c',
          700: '#23547e',
          800: '#1e4769',
          900: '#0f263d',   // Deep primary navy
          950: '#081726',   // Ultra navy midnight
        },
        navy: {
          800: '#111e38',
          850: '#0c172d',
          900: '#091124',
          950: '#050a17',
        },
        slate: {
          850: '#172033',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(16, 27, 53, 0.06), 0 1px 2px 0 rgba(16, 27, 53, 0.04)',
        'card-hover': '0 8px 20px -5px rgba(16, 27, 53, 0.12), 0 6px 8px -6px rgba(16, 27, 53, 0.08)',
        'modal': '0 12px 30px -8px rgba(16, 27, 53, 0.2)',
      }
    },
  },
  plugins: [],
}
