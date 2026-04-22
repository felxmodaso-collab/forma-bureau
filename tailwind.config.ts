import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/app/**/*.{ts,tsx}',
    './src/components/**/*.{ts,tsx}'
  ],
  theme: {
    extend: {
      colors: {
        graphite: '#1a1a1f',
        'graphite-deep': '#121216',
        paper: '#e8dcc4',
        'paper-dim': '#b8ae9a',
        amber: '#c8a878',
        'amber-deep': '#9c8059',
        'cool-shadow': '#2a2f3d',
        taupe: '#a8978f'
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'serif'],
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace']
      },
      letterSpacing: {
        press: '-0.015em'
      },
      fontSize: {
        'display-xl': ['clamp(3rem, 7vw, 6.5rem)', { lineHeight: '1.05', letterSpacing: '-0.02em' }],
        'display-lg': ['clamp(2.25rem, 4.2vw, 3.6rem)', { lineHeight: '1.1', letterSpacing: '-0.015em' }],
        'display-md': ['clamp(1.5rem, 2.4vw, 2.25rem)', { lineHeight: '1.15', letterSpacing: '-0.01em' }]
      },
      transitionTimingFunction: {
        dossier: 'cubic-bezier(0.65, 0, 0.35, 1)'
      },
      transitionDuration: {
        '1200': '1200ms',
        '1500': '1500ms',
        '1800': '1800ms'
      }
    }
  },
  plugins: []
};

export default config;
