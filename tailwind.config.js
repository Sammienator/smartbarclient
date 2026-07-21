/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        tag: ["Bungee", "Space Grotesk", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
        mono: ["IBM Plex Mono", "ui-monospace", "monospace"],
      },
      colors: {
        ink: "#111114",
        "ink-soft": "#1b1c22",
        "ink-line": "#2f3038",
        paper: "#f8f6ef",
        "paper-dim": "#eeeadd",
        amber: {
          DEFAULT: "#FFC22E",
          deep: "#FF8A00",
        },
        copper: "#FF3D7A",
        moss: {
          DEFAULT: "#00C29A",
          deep: "#009374",
        },
        electric: {
          DEFAULT: "#3757FF",
          deep: "#1E33B8",
        },
        danger: "#FF3355",
      },
      boxShadow: {
        pop: "4px 4px 0 0 #111114",
        "pop-sm": "3px 3px 0 0 #111114",
        "pop-lg": "6px 6px 0 0 #111114",
      },
      borderWidth: {
        3: "3px",
      },
      keyframes: {
        wiggle: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        blink: {
          "0%, 100%": { opacity: 1 },
          "50%": { opacity: 0.3 },
        },
      },
      animation: {
        wiggle: "wiggle 1.4s ease-in-out infinite",
        blink: "blink 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
