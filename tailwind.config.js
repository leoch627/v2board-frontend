/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        anime: {
          pink: '#FF6B9D',
          'pink-light': '#FFA8D5',
          purple: '#C77DFF',
          'purple-light': '#E0B0FF',
          blue: '#89CFF0',
          bg: '#FFF0F5',
        }
      },
      borderRadius: {
        'anime': '20px',
        'anime-lg': '30px',
      },
      boxShadow: {
        'anime': '0 8px 32px 0 rgba(255, 107, 157, 0.2)',
        'anime-hover': '0 12px 40px 0 rgba(255, 107, 157, 0.3)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'sparkle': 'sparkle 2s ease-in-out infinite',
        'bounce-slow': 'bounce 2s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        sparkle: {
          '0%, 100%': { opacity: '0' },
          '50%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
