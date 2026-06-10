/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb", // Blue 600
        secondary: "#1e40af", // Blue 800
        dark: "#020617", // Slate 950 (Black Blue)
        light: "#f8fafc", // Slate 50
        accent: "#3b82f6", // Blue 500
        card: "#0f172a", // Slate 900
      },
      borderRadius: {
        '2xl': '24px',
        '3xl': '32px',
      }
    },
  },
  plugins: [],
};
