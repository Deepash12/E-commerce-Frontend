/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        obsidian: {
          50: '#f5f5f0',
          100: '#e8e6e0',
          200: '#d0cdc5',
          300: '#b0aca0',
          400: '#888278',
          500: '#6a6560',
          600: '#524e4a',
          700: '#3d3a36',
          800: '#2a2825',
          900: '#1a1815',
          950: '#0d0c0a',
        },
        amber: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        gold: {
          50: '#fdf8ec',
          100: '#f9edcc',
          200: '#f2d88f',
          300: '#ebc04e',
          400: '#e4a823',
          500: '#c9891a',
          600: '#a96c14',
          700: '#875215',
          800: '#6f4117',
          900: '#5c3618',
        },
      },
      animation: {
        'fade-up': 'fadeUp 0.5s ease forwards',
        'fade-in': 'fadeIn 0.3s ease forwards',
        'slide-in': 'slideIn 0.4s ease forwards',
        'spin-slow': 'spin 3s linear infinite',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
      },
      keyframes: {
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(228, 168, 35, 0.4)' },
          '50%': { boxShadow: '0 0 0 8px rgba(228, 168, 35, 0)' },
        },
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'gold': '0 0 20px rgba(228, 168, 35, 0.15)',
        'gold-lg': '0 0 40px rgba(228, 168, 35, 0.2)',
        'inner-gold': 'inset 0 1px 0 rgba(228, 168, 35, 0.1)',
      },
    },
  },
  plugins: [],
}
