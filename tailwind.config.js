/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: '#0B1020',
        panel: '#151D30',
        blue: '#3987FF',
        purple: '#8B5CF6',
        green: '#22C55E',
        text: '#F8FAFC',
        'text-secondary': '#94A3B8',
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        display: ['Space Grotesk', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        glow: '0 0 20px rgba(57, 135, 255, 0.35)',
        'glow-purple': '0 0 20px rgba(139, 92, 246, 0.35)',
      },
      transitionTimingFunction: {
        smooth: 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
    },
  },
  plugins: [],
}
