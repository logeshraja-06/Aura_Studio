/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        rust: {
          DEFAULT: '#A8654A',
          dark: '#8C4F37',
          light: '#BD7B5E',
        },
        clay: {
          DEFAULT: '#B4735A',
          light: '#C5866D',
          dark: '#995942',
        },
        cream: {
          DEFAULT: '#FDF8F3',
          soft: '#FAF2EA',
          dark: '#F5E6D8',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E5BF43',
          dark: '#A6831A',
          glow: '#E9C08C',
        },
        charcoal: {
          DEFAULT: '#181818',
          light: '#252525',
          soft: '#2E2E2E',
        },
        luxury: {
          heading: '#A8654A',
          bg: '#FDF8F3',
          card: '#FFFFFF',
          accent: '#C9A227',
          body: '#2E2E2E',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(168, 101, 74, 0.12)',
        'gold-glow': '0 0 25px rgba(201, 162, 39, 0.35)',
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.08)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #FDF8F3 0%, #FAF2EA 100%)',
        'rust-gradient': 'linear-gradient(135deg, #A8654A 0%, #B4735A 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A227 0%, #E9C08C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #181818 0%, #252525 100%)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'shimmer': 'shimmer 2.5s infinite',
        'spin-slow': 'spin 20s linear infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
