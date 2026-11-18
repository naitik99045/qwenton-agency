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
        // Blueprint 3-Colour Design Tokens: Warm Ivory, Muted Sage, Dusty Plum (Section 02)
        canvas: 'var(--canvas-cream)',
        surface: {
          DEFAULT: 'var(--surface-white)',
          pure: 'var(--surface-pure)',
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
        // 1. Warm Ivory Family (#F4F0E8)
        ivory: {
          DEFAULT: '#F4F0E8',
          canvas: '#F4F0E8',
          card: '#FCFAF6',
          panel: '#FAF7F2',
          well: '#EDE8DE',
          border: '#DED8CD',
        },
        // 2. Muted Sage Family (#8FA99A)
        sage: {
          DEFAULT: '#8FA99A',
          deep: '#587363',
          dark: '#3A5245',
          light: '#EAF0EC',
          border: '#B9C9C0',
          hover: '#7E9A8B',
          active: '#6A8777',
        },
        // 3. Dusty Plum Family (#80627D)
        plum: {
          DEFAULT: '#80627D',
          deep: '#5E445B',
          dark: '#3C2A3A',
          light: '#F5EFF4',
          border: '#C4B5C1',
          hover: '#6E526B',
          active: '#5E445B',
        },
        // Mapped tokens strictly adhering to 3-colour palette
        linen: {
          DEFAULT: '#F4F0E8',
          light: '#FAF7F2',
          dark: '#EDE8DE',
          border: '#DED8CD',
        },
        moss: {
          DEFAULT: '#587363',
          deep: '#3A5245',
          surface: '#EAF0EC',
          muted: '#8FA99A',
          light: '#8FA99A',
          border: '#B9C9C0',
        },
        ochre: {
          DEFAULT: '#80627D',
          hover: '#6E526B',
          deep: '#5E445B',
          light: '#F5EFF4',
          border: '#C4B5C1',
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
        control: '8px',     // Blueprint Section 02: 8px controls
        panel: '12px',      // Blueprint Section 02: 12px panels
        card: '16px',       // Blueprint Section 02: 16–18px cards
        'card-lg': '18px',  // Blueprint Section 02: 16–18px cards
        modal: '20px',      // Blueprint Section 02: 20px modal shells
        hero: '24px',
      },
      boxShadow: {
        'clay-card': 'var(--shadow-clay-card)',
        'clay-card-hover': 'var(--shadow-clay-card-hover)',
        'clay-button': 'var(--shadow-clay-button)',
        'clay-button-subtle': 'var(--shadow-clay-button-subtle)',
        'clay-inset': 'var(--shadow-clay-inset)',
      },
      transitionDuration: {
        clay: '180ms', // Blueprint Section 02: 120–200ms restrained motion
      },
    },
  },
  plugins: [],
};

export default config;
