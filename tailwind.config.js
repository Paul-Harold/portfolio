/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ['Fraunces', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        paper: '#FAF8F5',
        ink: '#18181B',
        accent: {
          DEFAULT: '#C9252B',
          dark: '#A41C21',
        },
      },
    },
  },
  plugins: [],
}
