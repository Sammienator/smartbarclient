/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#16181d",
        "ink-soft": "#1e2128",
        "ink-line": "#2c303a",
        paper: "#faf7f0",
        "paper-dim": "#f1ece0",
        amber: {
          DEFAULT: "#e3a857",
          deep: "#b9812f",
        },
        copper: "#c9784f",
        moss: {
          DEFAULT: "#3d7a63",
          deep: "#2c5a49",
        },
        danger: "#b5453f",
      },
    },
  },
  plugins: [],
};
