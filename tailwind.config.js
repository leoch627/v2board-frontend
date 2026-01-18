/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Removed anime colors, keeping standard palette or adding professional ones if needed
        primary: '#0071e3', // Apple Blue
        secondary: '#86868b', // Apple Grey
        success: '#34c759', // Apple Green
        warning: '#ff9f0a', // Apple Orange
        danger: '#ff3b30', // Apple Red
        background: '#fbfbfd', // Apple Background
      },
      borderRadius: {
        // Standard professional radii
        'xl': '12px',
        '2xl': '18px',
        '3xl': '24px',
      },
      boxShadow: {
        'card': '0 4px 12px rgba(0, 0, 0, 0.04)',
        'card-hover': '0 8px 24px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}
