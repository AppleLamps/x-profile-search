/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          background: '#0f172a', // Slate 900
          'background-off': '#1e293b', // Slate 800
          'background-secondary': '#334155', // Slate 700
          accent: '#38bdf8', // Sky 400
          text: '#f8fafc', // Slate 50
          'text-secondary': '#94a3b8', // Slate 400
          border: '#334155', // Slate 700
          hover: '#1e293b', // Slate 800
          success: '#4ade80', // Green 400
        },
        // Add specific gradient colors
        brand: {
          start: '#3b82f6', // Blue 500
          end: '#8b5cf6', // Violet 500
        }
      },
      fontFamily: {
        sans: [
          'Outfit',
          'Inter',
          '-apple-system',
          'BlinkMacSystemFont',
          'Segoe UI',
          'sans-serif',
        ],
      },
      fontSize: {
        'heading-xl': '48px',
        'heading-lg': '36px',
        'heading-md': '24px',
        'heading-sm': '20px',
        body: '16px',
        small: '14px',
      },
      lineHeight: {
        body: '1.6',
      },
      spacing: {
        '8': '8px',
        '16': '16px',
        '24': '24px',
        '32': '32px',
        '48': '48px',
        '64': '64px',
      },
      borderRadius: {
        'card': '16px',
        'input': '12px',
        'button': '12px',
      },
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'input-focus': '0 0 0 2px rgba(56, 189, 248, 0.5)',
        'glow': '0 0 15px rgba(56, 189, 248, 0.5)',
      },
      maxWidth: {
        'container': '1200px',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

