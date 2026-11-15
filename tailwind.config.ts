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
        navy: {
          DEFAULT: '#0B1120',
          deep: '#070C16',
          surface: '#111C35',
          elevated: '#172342',
          border: '#1E2E54',
          light: '#F8FAFC',
        },
        ice: {
          DEFAULT: '#38BDF8',
          frost: '#7DD3FC',
          light: '#F1F5F9',
          card: '#E0F2FE',
          border: 'rgba(56, 189, 248, 0.25)',
        },
        orchid: {
          DEFAULT: '#D946EF',
          hover: '#E879F9',
          deep: '#A855F7',
          vibrant: '#C084FC',
          soft: 'rgba(217, 70, 239, 0.12)',
          glow: '0 8px 24px -4px rgba(217, 70, 239, 0.4)',
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
