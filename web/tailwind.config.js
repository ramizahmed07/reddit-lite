const colors = require("tailwindcss/colors");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontSize: {
      "2xsm": "10px",
      xsm: "12px",
      sm: "13px",
      reg: "14px",
      lg: "18px",
      "2xl": "22px",
      "3xl": "25px",
      "4xl": "32px",
      "5xl": "40px",
      "6xl": "50px",
      "7xl": "70px",
    },
    colors: {
      ...colors,
      primary: "#1A1A1B",
      secondary: "#cc3700",
      blue: "#5a75cc",
      border: "#343536",
      white: "#D7DADC",
      "light-white": "#818384",
      "light-blue": "#17232D",
      black: "#030303",
    },
    extend: {
      fontFamily: {
        ibm: ["var(--font-ibm)"],
        sans: ["var(--font-noto)"],
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
