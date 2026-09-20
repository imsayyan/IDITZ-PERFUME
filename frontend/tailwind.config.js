/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        luxury: {
          black: "#0F0E0E",
          noir: "#151413",
          charcoal: "#23211F",
          muted: "#34312E",
          border: "#3F3C38",
          lightBorder: "#E8E2D9",
          cream: "#FAF8F5",
          ivory: "#F4EFEA",
          sand: "#EFE8DF",
          gold: "#C5A880",
          goldLight: "#DFCAAE",
          goldDark: "#9A7B54",
          goldBright: "#D4AF37",
          amber: "#B85D19",
          rose: "#9B3D44"
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
      },
      letterSpacing: {
        'luxury': '0.2em',
        'wide-luxury': '0.3em',
      },
      boxShadow: {
        'subtle': '0 2px 10px rgba(0, 0, 0, 0.04)',
        'luxury': '0 10px 30px -10px rgba(15, 14, 14, 0.15)',
        'gold-glow': '0 0 25px rgba(197, 168, 128, 0.25)',
      }
    },
  },
  plugins: [],
}
