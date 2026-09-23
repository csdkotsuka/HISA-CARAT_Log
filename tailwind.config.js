/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        svt: {
          rosequartz: '#F7CAC9',
          rosequartzLight: '#FFF0F2',
          rosequartzDark: '#E5A5A4',
          serenity: '#92A8D1',
          serenityLight: '#E6EEFA',
          serenityDark: '#6B87B8',
          coral: '#FF7F50',
          coralLight: '#FFF2EE',
          gold: '#E0A96D',
          goldLight: '#FDF6ED',
          lavender: '#E6E6FA',
          lavenderDark: '#B39DDB',
        }
      },
      fontFamily: {
        sans: [
          '"Pretendard JP"',
          '"Hiragino Maru Gothic ProN"',
          '"Rounded Mplus 1c"',
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'sans-serif',
        ],
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(247, 202, 201, 0.25)',
        'glass-hover': '0 12px 40px 0 rgba(146, 168, 209, 0.35)',
        'glow-pink': '0 0 20px rgba(247, 202, 201, 0.6)',
        'glow-serenity': '0 0 20px rgba(146, 168, 209, 0.6)',
      },
      animation: {
        'float': 'float 3s ease-in-out infinite',
        'pulse-subtle': 'pulseSubtle 2.5s ease-in-out infinite',
        'sparkle': 'sparkle 1.5s ease-in-out infinite alternate',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        pulseSubtle: {
          '0%, 100%': { opacity: 1, transform: 'scale(1)' },
          '50%': { opacity: 0.92, transform: 'scale(1.02)' },
        },
        sparkle: {
          '0%': { transform: 'scale(0.95) rotate(0deg)', opacity: '0.8' },
          '100%': { transform: 'scale(1.1) rotate(6deg)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
