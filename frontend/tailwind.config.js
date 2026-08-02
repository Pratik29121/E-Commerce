/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#12161C",
        paper: "#F7F8FA",
        line: "#E4E7EC",
        brand: {
          50: "#EBF6F3",
          100: "#D2ECE4",
          400: "#2F9C82",
          500: "#0F7A63",
          600: "#0C6252",
          700: "#0A4F43",
        },
        amber: {
          400: "#E8A33D",
          500: "#D98D22",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
}

