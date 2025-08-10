import { type Config } from "tailwindcss";

export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        heading: ['var(--font-playfair-display)', 'serif'],
      },
      colors: {
        sage: {
          50: '#f6f7f6',
          100: '#e3e8e3',
          200: '#c7d2c7',
          300: '#a4b5a4',
          400: '#7d937d',
          500: '#5f7a5f',
          600: '#4a614a',
          700: '#3d4f3d',
          800: '#334133',
          900: '#2b362b',
        },
        cream: {
          50: '#fefcf8',
          100: '#fdf8f0',
          200: '#faf0e0',
          300: '#f5e6c8',
          400: '#eed5a3',
          500: '#e5c07b',
          600: '#d9a441',
          700: '#b8842c',
          800: '#956828',
          900: '#7a5526',
        },
        rose: {
          50: '#fdf2f2',
          100: '#fce7e7',
          200: '#f9d5d5',
          300: '#f4b6b6',
          400: '#ec8989',
          500: '#e06161',
          600: '#cd4545',
          700: '#ab3737',
          800: '#8e3131',
          900: '#762e2e',
        }
      },
    },
  },
} satisfies Config;
