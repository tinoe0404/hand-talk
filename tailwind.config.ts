import type { Config } from 'tailwindcss';

/**
 * Hand Talk - Medical-Grade Design System
 *
 * Color philosophy:
 * - Radiographer UI: clean clinical white with dark green accents (trust, calm, precision)
 * - Patient UI: dark navy background with high-contrast white/teal for maximum readability
 * - Alerts follow international medical color coding (green=ok, yellow=wait, orange=pain, red=emergency)
 *
 * Touch targets:
 * - Minimum 48x48px for all interactive elements (gloved hands in clinical settings)
 * - Emergency button: minimum 80x80px with pulse animation
 *
 * Typography:
 * - Patient-facing: minimum 32px for maximum readability at distance
 * - Radiographer-facing: minimum 18px for comfortable reading during sessions
 */
const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        /* ── Primary palette ──────────────────────────────── */
        clinical: {
          white: '#FFFFFF',
          offwhite: '#F8FAF9',
          light: '#E8F0EC',
        },
        medical: {
          green: {
            50: '#E8F5E9',
            100: '#C8E6C9',
            200: '#A5D6A7',
            300: '#81C784',
            400: '#66BB6A',
            500: '#2E7D32', // Primary dark green
            600: '#256427',
            700: '#1B5E20',
            800: '#145218',
            900: '#0D3B11',
            950: '#062006',
          },
        },

        /* ── Patient display palette (high-contrast navy) ─ */
        patient: {
          bg: '#0A192F',
          surface: '#112240',
          border: '#1D3557',
          text: '#E6F1FF',
          muted: '#8892B0',
          accent: '#64FFDA', // Teal accent — high contrast on navy
        },

        /* ── Medical alert colors (international standard) ─ */
        alert: {
          ok: '#4CAF50', // Green — Patient is okay (thumbs up)
          wait: '#FFC107', // Yellow — Stop/Wait (open palm)
          pain: '#FF9800', // Orange — Pain (peace sign)
          reposition: '#2196F3', // Blue — Needs repositioning (point down)
          emergency: '#F44336', // Red — Emergency/distress
        },

        /* ── Functional tokens ─────────────────────────────── */
        border: 'var(--border)',
        input: 'var(--input)',
        ring: 'var(--ring)',
        background: 'var(--background)',
        foreground: 'var(--foreground)',
        primary: {
          DEFAULT: 'var(--primary)',
          foreground: 'var(--primary-foreground)',
        },
        secondary: {
          DEFAULT: 'var(--secondary)',
          foreground: 'var(--secondary-foreground)',
        },
        destructive: {
          DEFAULT: 'var(--destructive)',
          foreground: 'var(--destructive-foreground)',
        },
        muted: {
          DEFAULT: 'var(--muted)',
          foreground: 'var(--muted-foreground)',
        },
        accent: {
          DEFAULT: 'var(--accent)',
          foreground: 'var(--accent-foreground)',
        },
        popover: {
          DEFAULT: 'var(--popover)',
          foreground: 'var(--popover-foreground)',
        },
        card: {
          DEFAULT: 'var(--card)',
          foreground: 'var(--card-foreground)',
        },
      },

      fontFamily: {
        sans: ['var(--font-geist-sans)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },

      fontSize: {
        /** Patient-facing: minimum 32px for readability at distance */
        'patient-base': ['2rem', { lineHeight: '2.5rem' }],
        'patient-lg': ['2.5rem', { lineHeight: '3rem' }],
        'patient-xl': ['3rem', { lineHeight: '3.5rem' }],
        'patient-2xl': ['4rem', { lineHeight: '4.5rem' }],
      },

      spacing: {
        /** Minimum 48×48 touch target for gloved hands in clinical settings */
        'touch-min': '48px',
        /** Emergency button minimum dimension (80×80px) */
        'emergency': '80px',
      },

      minWidth: {
        'touch': '48px',
        'emergency': '80px',
      },

      minHeight: {
        'touch': '48px',
        'emergency': '80px',
      },

      borderRadius: {
        'clinical': '12px',
        'card': '16px',
      },

      boxShadow: {
        'clinical': '0 1px 3px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'clinical-md': '0 4px 6px rgba(0, 0, 0, 0.05), 0 2px 4px rgba(0, 0, 0, 0.04)',
        'clinical-lg': '0 10px 15px rgba(0, 0, 0, 0.05), 0 4px 6px rgba(0, 0, 0, 0.03)',
        'alert-glow': '0 0 20px rgba(244, 67, 54, 0.4)',
      },

      animation: {
        /** Clinical pulse for emergency button — draws immediate attention */
        'pulse-emergency': 'pulse-emergency 2s ease-in-out infinite',
        /** Subtle fade-in for patient instructions — reduces cognitive load */
        'fade-in': 'fade-in 0.3s ease-out',
        /** Slide-up for alert banners — creates urgency hierarchy */
        'slide-up': 'slide-up 0.2s ease-out',
      },

      keyframes: {
        'pulse-emergency': {
          '0%, 100%': {
            boxShadow: '0 0 0 0 rgba(244, 67, 54, 0.4)',
          },
          '50%': {
            boxShadow: '0 0 0 12px rgba(244, 67, 54, 0)',
          },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'slide-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;
