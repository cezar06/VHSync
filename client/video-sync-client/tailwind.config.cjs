/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Y2K-inspired color palette
        cyber: {
          pink: '#FF66C4',
          blue: '#66E0FF',
          purple: '#B967FF',
          silver: '#E8E8E8',
          neon: '#CCFF00',
        },
        // Holographic gradients
        holo: {
          light: '#FFE9F9',
          mid: '#E5B8FF',
          dark: '#B967FF',
        },
        // Metallic colors
        metal: {
          chrome: '#E8E8E8',
          steel: '#B4B4B4',
          titanium: '#787878',
        }
      },
      backgroundImage: {
        'y2k-gradient': 'linear-gradient(45deg, #FF66C4, #66E0FF, #B967FF)',
        'chrome-gradient': 'linear-gradient(180deg, #FFFFFF 0%, #E8E8E8 50%, #B4B4B4 100%)',
        'holo-gradient': 'linear-gradient(45deg, #FFE9F9, #E5B8FF, #B967FF)',
      },
      boxShadow: {
        'y2k': '2px 2px 0 #000000',
        'neon': '0 0 10px #CCFF00',
        'chrome': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      borderWidth: {
        '3': '3px',
      },
      fontFamily: {
        'y2k': ['Helvetica', 'Arial', 'sans-serif'],
        'digital': ['VT323', 'monospace'],
      },
      animation: {
        'gradient': 'gradient 3s linear infinite',
        'glitch': 'glitch 1s linear infinite',
      },
      keyframes: {
        gradient: {
          '0%, 100%': {
            'background-position': '0% 50%'
          },
          '50%': {
            'background-position': '100% 50%'
          },
        },
        glitch: {
          '0%, 100%': { transform: 'translate(0)' },
          '33%': { transform: 'translate(-5px, 2px)' },
          '66%': { transform: 'translate(5px, -2px)' },
        }
      },
      spacing: {
        '128': '32rem',
      },
    },
  },
  plugins: [],
} 