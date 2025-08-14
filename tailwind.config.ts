import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './contexts/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      colors: {
        // Custom color palette for dark mode
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617',
        }
      },
      typography: {
        DEFAULT: {
          css: {
            // Dark mode prose styles
            '--tw-prose-invert-body': 'theme(colors.slate.200)',
            '--tw-prose-invert-headings': 'theme(colors.white)',
            '--tw-prose-invert-lead': 'theme(colors.slate.300)',
            '--tw-prose-invert-links': 'theme(colors.blue.400)',
            '--tw-prose-invert-bold': 'theme(colors.white)',
            '--tw-prose-invert-counters': 'theme(colors.slate.400)',
            '--tw-prose-invert-bullets': 'theme(colors.slate.600)',
            '--tw-prose-invert-hr': 'theme(colors.slate.700)',
            '--tw-prose-invert-quotes': 'theme(colors.slate.100)',
            '--tw-prose-invert-quote-borders': 'theme(colors.slate.700)',
            '--tw-prose-invert-captions': 'theme(colors.slate.400)',
            '--tw-prose-invert-code': 'theme(colors.white)',
            '--tw-prose-invert-pre-code': 'theme(colors.slate.300)',
            '--tw-prose-invert-pre-bg': 'theme(colors.slate.800)',
            '--tw-prose-invert-th-borders': 'theme(colors.slate.600)',
            '--tw-prose-invert-td-borders': 'theme(colors.slate.700)',
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}

export default config
