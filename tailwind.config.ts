import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: 'class',
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-sans)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
        display: ['var(--font-display)', 'var(--font-sans)', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      colors: {
        canvas: 'var(--canvas-cream)',
        surface: {
          DEFAULT: 'var(--surface-white)',
          inset: 'var(--surface-inset)',
          panel: 'var(--surface-panel)',
          dark: 'var(--surface-dark)',
        },
        ink: {
          DEFAULT: 'var(--ink)',
          muted: 'var(--ink-muted)',
          light: 'var(--ink-light)',
        },
        primary: {
          DEFAULT: 'var(--brand-primary)',
          deep: 'var(--brand-primary-deep)',
          light: 'var(--brand-primary-light)',
        },
        linen: {
          DEFAULT: '#F4EFEA',
          light: '#FAF7F2',
          dark: '#EBE3D7',
          border: '#DCD3C5',
        },
        moss: {
          DEFAULT: '#202D1E',
          deep: '#172215',
          surface: '#2B3D28',
          muted: '#4A5E44',
          light: '#6E8566',
          border: '#354932',
        },
        ochre: {
          DEFAULT: '#C88018',
          hover: '#DB9326',
          deep: '#9E620D',
          light: '#FDF4E7',
          border: '#E8C88A',
        },
        coral: {
          DEFAULT: 'var(--coral-approval)',
          hover: 'var(--coral-approval-hover)',
          light: 'var(--coral-approval-bg)',
        },
        success: {
          DEFAULT: 'var(--success)',
          light: 'var(--success-bg)',
        },
        amber: {
          approval: 'var(--approval-amber)',
          light: 'var(--approval-amber-bg)',
        },
        danger: {
          DEFAULT: 'var(--danger)',
          light: 'var(--danger-bg)',
        },
        border: {
          DEFAULT: 'var(--border-subtle)',
          strong: 'var(--border-strong)',
          subtle: 'var(--border-subtle)',
        },
      },
      borderRadius: {
        control: '14px',
        card: '20px',
        hero: '28px',
      },
      boxShadow: {
        'clay-card': 'var(--shadow-clay-card)',
        'clay-card-hover': 'var(--shadow-clay-card-hover)',
        'clay-button': '0 4px 14px rgba(18, 232, 150, 0.35)',
        'clay-button-subtle': 'var(--shadow-clay-button-subtle)',
        'clay-inset': 'var(--shadow-clay-inset)',
      },
    },
  },
  plugins: [],
};

export default config;
