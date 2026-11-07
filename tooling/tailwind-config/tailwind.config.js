/** @type {import('tailwindcss').Config} */
module.exports = {
  // Support both the conventional `.dark` class and the `data-theme="dark"`
  // attribute used by cookie/SSR theme systems.
  darkMode: [
    'variant',
    '&:where(.dark, .dark *, [data-theme="dark"], [data-theme="dark"] *)',
  ],
  content: [
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: {
      center: true,
      // Responsive side gutters: 1rem on phones (2rem per side ate ~18% of a
      // 360px viewport), 2rem from sm up.
      padding: { DEFAULT: '1rem', sm: '2rem' },
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        success: {
          DEFAULT: 'hsl(var(--success))',
          foreground: 'hsl(var(--success-foreground))',
        },
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          foreground: 'hsl(var(--warning-foreground))',
          ink: 'hsl(var(--warning-ink))',
        },
        info: {
          DEFAULT: 'hsl(var(--info))',
          foreground: 'hsl(var(--info-foreground))',
          ink: 'hsl(var(--info-ink))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
        inverse: {
          DEFAULT: 'hsl(var(--inverse))',
          foreground: 'hsl(var(--inverse-foreground))',
          muted: 'hsl(var(--inverse-muted))',
          'muted-foreground': 'hsl(var(--inverse-muted-foreground))',
          border: 'hsl(var(--inverse-border))',
          card: 'hsl(var(--inverse-card))',
          'card-foreground': 'hsl(var(--inverse-card-foreground))',
          primary: 'hsl(var(--inverse-primary))',
          'primary-foreground': 'hsl(var(--inverse-primary-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      transitionDuration: {
        fast: 'var(--motion-fast)',
        normal: 'var(--motion-normal)',
        slow: 'var(--motion-slow)',
      },
      transitionTimingFunction: {
        'standard': 'var(--motion-ease)',
        'in': 'var(--motion-ease-in)',
        'out': 'var(--motion-ease-out)',
      },
      spacing: {
        'density': 'var(--density-space)',
        'control-height': 'var(--density-control-height)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
