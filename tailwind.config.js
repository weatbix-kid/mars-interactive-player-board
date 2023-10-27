/** @type {import('tailwindcss').Config} */
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  content: [],
  theme: {
    extend: {
      backgroundImage: {
        'space-sm': "url('/src/assets/bg-sm.jpg')",
        'space-lg': "url('/src/assets/bg-lg.jpg')"
      },
      gridTemplateColumns: {
        stc: 'repeat(22, 1fr)',
        skr: 'repeat(20, 1fr)'
      }
    }
  },
  plugins: []
}
