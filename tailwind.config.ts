import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: '#0A2540',
          50: '#F4F7FB',
          100: '#E6ECF4',
          200: '#C5D2E5',
          300: '#94A8C8',
          400: '#5C76A0',
          500: '#324E7A',
          600: '#1E365C',
          700: '#142849',
          800: '#0A2540',
          900: '#061A30',
        },
        accent: {
          DEFAULT: '#EE8826',
          50: '#FEF6EE',
          100: '#FBE6CC',
          500: '#EE8826',
          600: '#D17314',
          700: '#A85A0E',
        },
        surface: '#FFFFFF',
        muted: '#F7F9FC',
        border: '#E4E9F2',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        'display-2xl': ['80px', { lineHeight: '1.02', letterSpacing: '-0.025em', fontWeight: '600' }],
        'display-xl': ['64px', { lineHeight: '1.05', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-lg': ['52px', { lineHeight: '1.08', letterSpacing: '-0.02em', fontWeight: '600' }],
        'display-md': ['40px', { lineHeight: '1.1', letterSpacing: '-0.015em', fontWeight: '600' }],
        'display-sm': ['32px', { lineHeight: '1.15', letterSpacing: '-0.01em', fontWeight: '600' }],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10,37,64,0.04), 0 1px 3px rgba(10,37,64,0.06)',
        'card-hover': '0 4px 8px rgba(10,37,64,0.06), 0 12px 24px rgba(10,37,64,0.08)',
      },
      maxWidth: {
        '8xl': '1440px',
      },
    },
  },
  plugins: [],
};

export default config;
