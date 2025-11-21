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
          background: '#FFFFFF', // Pure white
          'background-off': '#F9FAFB', // Subtle off-white
          'background-secondary': '#F3F4F6', // Light gray
          'background-tertiary': '#E5E7EB', // Medium gray
          accent: '#2563EB', // Professional blue
          'accent-hover': '#1D4ED8', // Darker blue
          'accent-light': '#DBEAFE', // Light blue
          text: '#111827', // Rich black
          'text-secondary': '#6B7280', // Medium gray
          'text-tertiary': '#9CA3AF', // Light gray
          border: '#E5E7EB', // Subtle border
          'border-light': '#F3F4F6', // Very light border
          hover: '#F9FAFB', // Subtle hover
          success: '#10B981', // Green
          warning: '#F59E0B', // Amber
          error: '#EF4444', // Red
        },
        // Brand gradient colors
        brand: {
          start: '#2563EB', // Professional blue
          mid: '#3B82F6', // Bright blue
          end: '#60A5FA', // Light blue
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
        'card': '20px',
        'input': '12px',
        'button': '12px',
        'badge': '8px',
      },
      boxShadow: {
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.05), 0 1px 2px -1px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.08), 0 4px 6px -4px rgba(0, 0, 0, 0.05)',
        'input-focus': '0 0 0 4px rgba(37, 99, 235, 0.1)',
        'button': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'button-hover': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)',
        'xl': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
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

