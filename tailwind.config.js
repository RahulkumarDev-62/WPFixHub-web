/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#3B82F6',      // Blue
        secondary: '#A855F7',    // Purple
        dark: '#1F2937',         // Dark Gray
        light: '#F3F4F6',        // Light Gray
        success: '#10B981',      // Green
        warning: '#F59E0B',      // Amber
        error: '#EF4444',        // Red
      },
      backgroundImage: {
        'gradient-bg': 'linear-gradient(135deg, #3B82F6 0%, #A855F7 100%)',
      },
      boxShadow: {
        'card-shadow': '0 4px 6px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'slideUp': 'slideUp 0.5s ease-out',
        'fadeIn': 'fadeIn 0.5s ease-out',
        'spin': 'spin 1s linear infinite',
      },
      keyframes: {
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      transitionDuration: {
        '300': '300ms',
      },
    },
  },
  plugins: [],
}
