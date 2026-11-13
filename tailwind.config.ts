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
      },
      colors: {
        canvas: 'var(--canvas-cream)',
        surface: {
          DEFAULT: 'var(--surface-white)',
          inset: 'var(--surface-inset)',
          panel: 'var(--surface-panel)',
        },
        'cloud-blue': 'var(--brand-primary-light)',
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
        control: '16px',
        card: '22px',
        hero: '28px',
      },
      boxShadow: {
        'clay-card': 'var(--shadow-clay-card)',
        'clay-card-hover': 'var(--shadow-clay-card-hover)',
        'clay-button': '0 4px 12px rgba(217, 107, 39, 0.28), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        'clay-button-subtle': 'var(--shadow-clay-button-subtle)',
        'clay-inset': 'var(--shadow-clay-inset)',
      },
    },
  },
  plugins: [],
};

export default config;
