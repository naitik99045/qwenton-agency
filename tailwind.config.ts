import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        canvas: '#F8F6F1',
        'cloud-blue': '#E6EEF8',
        'soft-lavender': '#EAE7F5',
        sage: '#DCEBE1',
        peach: '#F5DED1',
        butter: '#F6E8BA',
        ink: {
          DEFAULT: '#263247',
          muted: '#697386',
          light: '#9AA2B1',
        },
        primary: {
          DEFAULT: '#4667B1',
          deep: '#34518F',
          light: '#E6EEF8',
        },
        success: {
          DEFAULT: '#3E856A',
          light: '#E5F4EC',
        },
        amber: {
          approval: '#B98232',
          light: '#FDF4E7',
        },
        danger: {
          DEFAULT: '#B95151',
          light: '#FDECEC',
        },
        border: {
          DEFAULT: '#E3E0D8',
          subtle: '#EDEAE3',
        },
      },
      borderRadius: {
        control: '16px',
        card: '22px',
        hero: '28px',
      },
      boxShadow: {
        'clay-card': '10px 10px 24px rgba(82, 78, 70, 0.08), -6px -6px 18px rgba(255, 255, 255, 0.90)',
        'clay-card-hover': '12px 12px 28px rgba(82, 78, 70, 0.12), -8px -8px 20px rgba(255, 255, 255, 0.95)',
        'clay-button': '0 4px 14px rgba(52, 81, 143, 0.25), inset 0 1px 1px rgba(255, 255, 255, 0.40)',
        'clay-button-subtle': '4px 4px 12px rgba(82, 78, 70, 0.06), -3px -3px 8px rgba(255, 255, 255, 0.85)',
        'clay-inset': 'inset 2px 2px 5px rgba(82, 78, 70, 0.06), inset -2px -2px 5px rgba(255, 255, 255, 0.80)',
      },
    },
  },
  plugins: [],
};

export default config;
