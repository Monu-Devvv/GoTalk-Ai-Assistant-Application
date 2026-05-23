/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./App.{js,ts,jsx}',
    './src/screens/**/*.{js,ts,tsx}',
    './src/components/**/*.{js,ts,tsx}'],

  presets: [require('nativewind/preset')],
  theme: {
    extend: {},
  },
  plugins: [],
};
