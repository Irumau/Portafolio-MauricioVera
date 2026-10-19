/** @type {import('tailwindcss').Config} */
// Paleta y tipografías del diseño "Midnight Hour".
// Se carga desde src/styles/index.css con la directiva @config.
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        night: { DEFAULT: '#07142E', deep: '#050F24' },
        panel: { DEFAULT: '#12295A', light: '#0F2A63' },
        ice: '#EAF6FF',
        mist: '#B9CCE8',
        dim: '#8FA8CC',
        ink: '#2C4470',
        accent: '#49D3FF',
        ok: '#7CF0D0',
        warn: '#FFD34D',
      },
      fontFamily: {
        display: ['"Big Shoulders Display"', '"Arial Narrow"', 'sans-serif'],
        sans: ['Chivo', '"Helvetica Neue"', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
    },
  },
}
