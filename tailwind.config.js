/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: ["./views/**/*.{html,js,hbs}"],
  theme: {
    extend: {
      colors: {
        ks: {
          dark: {
            foreground: "#212121",
            foregroundActive: "#383838",
            foregroundHover: '#555',
            background: "#181818",
            text: "#fff",
            subText: "#aaa",
            border: "#343536"
          },
          light: {
            foreground: "#fff",
            foregroundActive: "#e5e5e5",
            foregroundHover: '#d5d5d5',
            background: "#f9f9f9",
            text: "#030303",
            subText: "#606060",
            border: "#ccc"
          },
        },
      },
      animation: {
        wiggle: 'wiggle 1s ease-in-out infinite',
        pulse2: 'pulse2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
        ping2: 'ping2 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;',
      },
      keyframes: {
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        pulse2: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: .75 },
        },
        ping2: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.15)' },
        }
      },
    },
  },
  plugins: [],
}
