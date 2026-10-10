import type { Config } from 'tailwindcss';

const config: Config = {
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
        'cloud-blue': 'var(--brand-primary-light)',
        'soft-lavender': 'var(--soft-lavender)',
        sage: '#DCEBE1',
        peach: 'var(--peach)',
        butter: 'var(--butter)',
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
        'clay-card': '10px 10px 24px rgba(82, 78, 70, 0.08), -6px -6px 18px rgba(255, 255, 255, 0.90)',
        'clay-card-hover': '14px 14px 30px rgba(82, 78, 70, 0.12), -8px -8px 20px rgba(255, 255, 255, 0.95)',
        'clay-button': '0 4px 12px rgba(52, 81, 143, 0.22), inset 0 1px 1px rgba(255, 255, 255, 0.35)',
        'clay-button-subtle': '4px 4px 12px rgba(82, 78, 70, 0.06), -3px -3px 8px rgba(255, 255, 255, 0.85)',
        'clay-inset': 'inset 2px 2px 6px rgba(82, 78, 70, 0.07), inset -2px -2px 6px rgba(255, 255, 255, 0.80)',
        'clay-persp': '0 24px 48px -12px rgba(38, 50, 71, 0.14), 0 10px 20px -8px rgba(38, 50, 71, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
