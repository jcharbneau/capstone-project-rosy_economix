/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './src/**/*.{js,jsx}', // Adjust this based on your project structure
    './public/index.html', // Include this if you have an index.html in public
  ],
  mode: 'jit',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
      animation: {
        'infinite-scroll': 'infinite-scroll 30s linear infinite',
        'text-reveal': 'text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s',
      },
      keyframes: {
        'infinite-scroll': {
          from: { transform: 'translateX(0)' },
          to: { transform: 'translateX(-100%)' },
        },
        'text-reveal': {
          '0%': {
            transform: 'translate(0, 100%)',
          },
          '100%': {
            transform: 'translate(0, 0)',
          },
        },
      },
      colors: {
        primary: '#050816',
        secondary: '#aaa6c3',
        tertiary: '#151030',
        'black-100': '#100d25',
        'black-200': '#090325',
        'white-100': '#f3f3f3',
        'jcblue-100': '#4A80FF',
        'bg-rosy': '#FF007F',
      },
      image: {
        flex: 1,
        aspectRatio: 1.5,
        resizeMode: 'contain',
      },
      boxShadow: {
        card: '0px 35px 120px -15px #211e35',
      },
      screens: {
        xs: '450px',
      },
      backgroundImage: {
        'hero-pattern': "url('/src/assets/blue-galaxy-bg.jpg')",
      },
      jc: {
        'blue-100': '#4A80FF',
      },
    },
  },
  plugins: [require('@tailwindcss/aspect-ratio')],
};
