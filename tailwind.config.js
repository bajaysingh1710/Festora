/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        festora: {
          cream: '#FFF8EF',
          terracotta: {
            DEFAULT: '#C96F4A',
            dark: '#A8522F',
            light: '#E28E6C',
            subtle: '#FAF0EB',
          },
          gold: {
            DEFAULT: '#F2C66D',
            dark: '#D9A948',
            light: '#F8DB9B',
            subtle: '#FEF9ED',
          },
          sage: {
            DEFAULT: '#A9B89A',
            dark: '#859675',
            light: '#C8D4BD',
            subtle: '#F2F6F0',
          },
          peach: {
            DEFAULT: '#F5D1BD',
            dark: '#E2AE93',
            light: '#FBE8DC',
          },
          brown: {
            DEFAULT: '#49372D',
            dark: '#32251D',
            light: '#6E5548',
            subtle: '#EAE5E1',
          }
        }
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'festive': '0 10px 30px -5px rgba(201, 111, 74, 0.15)',
        'festive-lg': '0 20px 40px -10px rgba(73, 55, 45, 0.12)',
        'card': '0 2px 12px -2px rgba(73, 55, 45, 0.06), 0 1px 3px rgba(73, 55, 45, 0.04)',
      }
    },
  },
  plugins: [],
}
