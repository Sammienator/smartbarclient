/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        paper: {
          DEFAULT: "#f7f4ef",
          dim: "#efeae2",
        },
        ink: {
          DEFAULT: "#1a1a1a",
          soft: "#2a2a2a",
          line: "#3a3a3a",
        },
        amber: {
          DEFAULT: "#ffc22e",
          deep: "#e6a800",
        },
        copper: "#e07a3d",
        moss: "#00c29a",
        electric: "#4f7cff",
        danger: "#e5484d",
      },
      fontFamily: {
        display: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        tag: ['"Space Grotesk"', "Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        pop: "3px 3px 0 0 #1a1a1a",
        "pop-lg": "5px 5px 0 0 #1a1a1a",
      },
      borderWidth: {
        3: "3px",
      },
    },
  },
  plugins: [],
};
