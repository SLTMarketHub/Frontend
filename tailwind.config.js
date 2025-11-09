/** @type {import('tailwindcss').Config} */
import tailwindScrollbarHide from 'tailwind-scrollbar-hide'

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'slt-primary': '#003366',  // Dark navy blue
        'slt-secondary': '#0066CC', // Main blue
        'slt-cyan': '#00ACC1',      // Cyan/Teal
        'slt-teal': '#008B8B',      // Darker teal
        'slt-green': '#00A651',     // Green
        'slt-dark': '#001A33',      // Very dark blue
        'slt-light': '#E6F7FF',     // Light blue
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
        warning: '#F59E0B',
        error: '#EF4444',
        info: '#3B82F6',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'slt-gradient': 'linear-gradient(135deg, #003366 0%, #0066CC 25%, #00ACC1 50%, #00A651 100%)',
        'slt-gradient-dark': 'linear-gradient(180deg, #001A33 0%, #003366 50%, #0066CC 100%)',
        'slt-gradient-light': 'linear-gradient(135deg, #0066CC 0%, #00ACC1 50%, #00A651 100%)',
        'slt-gradient-subtle': 'linear-gradient(135deg, #E3F2FD 0%, #E0F2F1 100%)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['Poppins', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'sidebar': '2px 0 8px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-in-out',
        'slide-in': 'slideIn 0.3s ease-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [
    tailwindScrollbarHide
  ],
};
