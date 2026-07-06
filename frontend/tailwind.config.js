/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'ink-navy': '#1B2A4A',
        'paper': '#EDEBE2',
        'marigold': '#E2962B',
        'stamp-red': '#A13D2E',
        'moss': '#4B6B4F',
        'ink-text': '#23262B',
      },
      fontFamily: {
        fraunces: ['Fraunces', 'serif'],
        sans: ['IBM Plex Sans', 'sans-serif'],
        mono: ['IBM Plex Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
