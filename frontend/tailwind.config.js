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
          DEFAULT: '#8B5E3C',
          dark: '#6E472C',
          light: '#A4734F',
        },
        clay: {
          DEFAULT: '#B87352',
          light: '#C68565',
          dark: '#7A4A2D',
        },
        cream: {
          DEFAULT: '#F7F1E8',
          soft: '#F3E9DC',
          dark: '#E5D8C8',
        },
        gold: {
          DEFAULT: '#C9A227',
          light: '#E9C08C',
          dark: '#9E7A1A',
          glow: '#F2D18C',
        },
        charcoal: {
          DEFAULT: '#1F140D',
          light: '#2B1B12',
          soft: '#3A2A1E',
        },
        luxury: {
          heading: '#8B5E3C',
          bg: '#F7F1E8',
          card: '#FFFFFF',
          accent: '#B87352',
          body: '#3A2A1E',
        }
      },
      fontFamily: {
        serif: ['"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['Poppins', 'sans-serif'],
        montserrat: ['Montserrat', 'sans-serif'],
      },
      boxShadow: {
        'luxury': '0 20px 40px -15px rgba(139, 94, 60, 0.12)',
        'gold-glow': '0 0 25px rgba(201, 162, 39, 0.35)',
        'gold-glow-shadow': '0 10px 30px -5px rgba(201, 162, 39, 0.3)',
        'glass': '0 8px 32px 0 rgba(31, 20, 13, 0.08)',
      },
      backgroundImage: {
        'luxury-gradient': 'linear-gradient(135deg, #F7F1E8 0%, #F3E9DC 100%)',
        'rust-gradient': 'linear-gradient(135deg, #8B5E3C 0%, #B87352 100%)',
        'gold-gradient': 'linear-gradient(135deg, #C9A227 0%, #F2D18C 100%)',
        'dark-gradient': 'linear-gradient(180deg, #2B1B12 0%, #1F140D 100%)',
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
