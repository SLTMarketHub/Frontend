/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          900: "#00032e",
          500: "#edbf6d",
          400: "#d9a856",
        },
      },
    },
  },
  plugins: [],
};
