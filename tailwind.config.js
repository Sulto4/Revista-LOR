/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'revista-white': '#FFFFFF',
        'revista-text': '#1A1A1A',
        'revista-black': '#000000',
        'revista-ivory': '#F7F1EB',
        'revista-separator': '#E5E1DC',
        'revista-gold': '#C6A667',
      },
      fontFamily: {
        'sans': ['Inter', 'sans-serif'],
        'headline': ['Arimo', 'sans-serif'],
        'serif': ['serif'],
      },
      fontSize: {
        'h1': ['64px', { lineHeight: '1.1', letterSpacing: '-0.02em' }],
        'h2': ['48px', { lineHeight: '1.2', letterSpacing: '-0.01em' }],
        'h3': ['32px', { lineHeight: '1.3' }],
        'body': ['18px', { lineHeight: '1.6' }],
        'metadata': ['14px', { lineHeight: '1.5' }],
      },
      spacing: {
        'section': '120px',
        'grid': '36px',
        'card': '32px',
      },
      animation: {
        'shimmer': 'shimmer 1.5s ease-in-out infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { backgroundPosition: '200% 0' },
          '100%': { backgroundPosition: '-200% 0' },
        },
      },
    },
  },
  plugins: [],
};
