const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: colors.pink,
        secondary: "#ecc94b",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
