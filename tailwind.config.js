/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      spacing: {
        '18': '4.5rem', // 72px
      },
      fontFamily: {
        'primary': ['Orbitron', 'sans-serif'],
        'mono': ['SpaceMono', 'monospace'],
        'terminal': ['OCRA', 'monospace'],
        'sans': ['Orbitron', 'sans-serif'],
      },
    },
  },
  plugins: [],
}