module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Dark Theme Colors
        background: "#1E1E2E",
        text: "#D9E0EE",
        "primary-accent": "#7AA2F7",
        "secondary-accent": "#A28DEB",
        border: "#2A2A40",
        'primary-highlight': "#8aabf2",
        'secondary-highlight': "#BB9AF7",

        // Supporting Colors
        success: "#A6E3A1",
        warning: "#E0AF68",
        error: "#F7768E",
        info: "#7DCFFF",
      },
      gradientColorStops: theme => ({
        ...theme('colors'), // Ensures existing colors are available for gradients
        "accent-gradient-start": "#7AA2F7",
        "accent-gradient-end": "#A28DEB",
        "background-gradient-start": "#1E1E2E",
        "background-gradient-end": "#121221",
      }),
      // bg-gradient-to-r from-accent-gradient-start to-accent-gradient-end
      backgroundImage: {
        "accent-gradient": "linear-gradient(90deg, #7AA2F7, #A28DEB)",
        "background-gradient": "linear-gradient(180deg, #1E1E2E, #121221)",
      },
      fontFamily: {
        sans: ['Inria Sans', 'ui-sans-serif', 'system-ui', 'sans-serif'], // Add Inria Sans
      },
      animation: {
        shake: 'shake 0.5s ease-in-out',
      },
      keyframes: {
        shake: {
          '0%': { transform: 'translateX(0)' },
          '25%': { transform: 'translateX(-10px)' },
          '50%': { transform: 'translateX(10px)' },
          '75%': { transform: 'translateX(-10px)' },
          '100%': { transform: 'translateX(0)' },
        },
      },
      boxShadow: {
        neonInner: 'inset 0 0 10px #a6e3a1, inset 0 0 20px #a6e3a1', // Smaller inner neon glow effect
      },
    },
  },
  plugins: [],
}
