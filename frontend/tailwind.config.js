/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Plus Jakarta Sans"', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          50: '#f0f0ff',
          100: '#e0dfff',
          200: '#c2bfff',
          300: '#9b95ff',
          400: '#7b6fff',
          500: '#6650fa',
          600: '#5538e8',
          700: '#4828c7',
          800: '#3b20a2',
          900: '#311d7e',
        },
        surface: {
          50: '#fafaf9',
          100: '#f5f3f0',
          200: '#eceae6',
          300: '#ddd9d2',
        },
        aurora: {
          pink: '#f0abfc',
          violet: '#a78bfa',
          cyan: '#67e8f9',
          emerald: '#6ee7b7',
        },
      },
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },
      boxShadow: {
        glass: '0 8px 32px rgba(101, 80, 250, 0.08)',
        'glass-lg': '0 16px 48px rgba(101, 80, 250, 0.12)',
        'glow-brand': '0 0 40px rgba(101, 80, 250, 0.15)',
        'glow-cyan': '0 0 40px rgba(103, 232, 249, 0.2)',
        float: '0 20px 60px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'float-slow': 'floatSlow 8s ease-in-out infinite',
        'float-medium': 'floatMedium 6s ease-in-out infinite',
        'float-fast': 'floatFast 4s ease-in-out infinite',
        'pulse-soft': 'pulseSoft 3s ease-in-out infinite',
        'slide-up': 'slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in-right': 'slideInRight 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'fade-in': 'fadeIn 0.5s ease-out',
        shimmer: 'shimmer 2s linear infinite',
        'spin-slow': 'spin 6s linear infinite',
      },
      keyframes: {
        floatSlow: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-20px) rotate(2deg)' },
        },
        floatMedium: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-14px) rotate(-1.5deg)' },
        },
        floatFast: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        pulseSoft: {
          '0%, 100%': { opacity: 0.6 },
          '50%': { opacity: 1 },
        },
        slideUp: {
          '0%': { opacity: 0, transform: 'translateY(24px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
        slideInRight: {
          '0%': { opacity: 0, transform: 'translateX(24px)' },
          '100%': { opacity: 1, transform: 'translateX(0)' },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      backgroundImage: {
        'gradient-brand': 'linear-gradient(135deg, #6650fa 0%, #4828c7 100%)',
        'gradient-aurora':
          'linear-gradient(135deg, #f0abfc 0%, #a78bfa 30%, #67e8f9 70%, #6ee7b7 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.9) 0%, rgba(255,255,255,0.6) 100%)',
      },
    },
  },
  plugins: [],
};
