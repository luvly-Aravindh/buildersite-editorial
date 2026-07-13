/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        // BuilderSite brand tokens
        bg: '#F5F4F0',
        ink: '#1A1A1A',
        accent: '#8B5E3C',
        muted: '#6B6B6B',
        line: '#D4D4D0',
        surface: '#EDECEA',
        success: '#3D7A4A',
        alert: '#A04040',
        blue: '#3b5afe',
        cta1: '#d07a3c',
        cta2: '#b1561f',
        sand: '#e7c9a8',
        amber: '#e6ac6d',
        lime: '#c5f56b',
        // editorial (newspaper) tokens
        news: '#1a4fa3',
        newsink: '#111111'
      },
      fontFamily: {
        sans: ['Archivo', 'Helvetica Neue', 'Helvetica', 'sans-serif'],
        serif: ['Newsreader', 'Times New Roman', 'serif'],
        body: ['"Source Serif 4"', 'Georgia', 'serif'],
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        ui: ['Inter', 'system-ui', 'sans-serif']
      },
      maxWidth: { content: '1200px' }
    }
  },
  // The ported stylesheet already ships its own reset (`*{margin:0;padding:0;box-sizing:border-box}`)
  // scoped per page. Tailwind's Preflight would fight it (img{display:block}, heading resets)
  // and shift the approved layout, so it stays off. Utilities still work normally.
  corePlugins: { preflight: false },
  plugins: []
}
