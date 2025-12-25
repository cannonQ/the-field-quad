/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",    
  ],
  theme: {
    extend: {
      colors: {
        "dark-body": "#1A202C", // same color as chakra dark bg
        "brand": {
          400: '#10395F',
          500: '#060C22',
      },
      },
      backgroundImage: {
        'radial-gradient': 'radial-gradient(169.40% 89.55% at 94.76% 6.29%, #060C22 0%, #10395F 100%)',
      },
    },
  },
  plugins: [],
}

