/** @type {import('tailwindcss').Config} */
const plugin = require('tailwindcss/plugin');
module.exports = {
  content: ['./App.tsx', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2AAA78',
          dark: '#2AAA78',
        },
        secondary: {
          DEFAULT: '#0279FF',
          dark: '#0279FF',
        },
        tertiary: {
          DEFAULT: '#66A7CA',
          dark: '#66A7CA',
        },
        danger: {
          DEFAULT: '#E03C4D',
          alt: '#450c18',
        },
        warning: {
          DEFAULT: '#f59e0b',
          dark: '#f59e0b',
        },
        success: {
          dark: '#2AAA78',
          DEFAULT: '#2AAA78',
        },
        bubbleBackground: {
          dark: '#242527',
        },
        background: {
          DEFAULT: '#fafafa',
          dark: '#000000',
        },
        backgroundAlt: {
          dark: '#1C1C1E',
        },
        fieldBackground: {
          DEFAULT: '#e1e1e1',
          dark: '#202020',
        },
        foreground: {
          DEFAULT: '#202020',
          dark: '#f0f0f0',
        },
        foregroundAlt: {
          DEFAULT: '#bdbdbd',
          dark: '#455A64',
        },
        neutral: {
          900: '#171717',
          800: '#262626',
          500: '#737373',
          400: '#a3a3a3',
          300: '#d4d4d4',
          200: '#e5e5e5',
          100: '#f5f5f5',
        },
        white: '#FFFFFF',
        black: '#000000',
        premium: {
          1: '#F3DD7F',
          2: '#E0C15F',
          3: '#B58113',
        },
        badge: {
          'gold-foreground': '#feb602',
          'gold-background': '#D4AF37',
          'gold-accent': '#e18b00',
          'silver-foreground': '#bdc3c7',
          'silver-background': '#dcdfe1',
          'silver-accent': '#a6aeb4',
          'bronze-foreground': '#cd7f32',
          'bronze-background': '#d69c49',
          'bronze-accent': '#b5622a',
        },
      },
    },
  },
  plugins: [],
};
