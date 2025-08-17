/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx,md}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        muted: "rgb(var(--muted) / <alpha-value>)",
        border: "rgb(var(--border) / <alpha-value>)",
        primary: "rgb(var(--primary) / <alpha-value>)",
      },
      typography: ({ theme }) => ({
        DEFAULT: {
          css: {
            maxWidth: '80ch',
            color: theme('colors.foreground'),
            a: { textDecoration: 'none' },
            'h1,h2,h3,h4': { color: theme('colors.foreground') },
            code: { backgroundColor: theme('colors.muted'), padding: '0.2rem 0.35rem', borderRadius: '0.375rem' },
            pre: { backgroundColor: theme('colors.muted'), borderRadius: '0.75rem', padding: '1rem' },
            blockquote: { borderLeftColor: theme('colors.border') }
          }
        },
      })
    },
  },
  plugins: [require('@tailwindcss/typography')],
}
