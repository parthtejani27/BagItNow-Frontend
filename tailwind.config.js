/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#f8faf9",
          100: "#f0f5f2",
          200: "#dce8e1",
          300: "#b8d1c3",
          400: "#89b29d",
          500: "#58916f",
          600: "#3d7355",
          700: "#2e5841",
          800: "#234432",
          900: "#1a3326",
        },
        secondary: {
          50: "#fff8f1",
          100: "#feecdc",
          200: "#fcd9bd",
          300: "#fdba8c",
          400: "#ff8a4c",
          500: "#ff5a1f",
          600: "#d03801",
          700: "#b43403",
          800: "#8a2c0d",
          900: "#771d1d",
        },
      },
    },
  },
  plugins: [],
};
