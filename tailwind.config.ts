import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './content/**/*.{json,md,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        deep: 'var(--deep)',
        green: {
          DEFAULT: 'var(--green)',
          hover: '#6ff0b8',
        },
        orange: {
          DEFAULT: 'var(--orange)',
          hover: '#ffa062',
        },
        foam: 'var(--foam)',
        mute: 'var(--mute)',
        ink: 'var(--ink)',
      },
      fontFamily: {
        heading: ['var(--font-newsreader)', 'Georgia', 'serif'],
        sans: ['var(--font-dm-sans)', 'system-ui', 'sans-serif'],
      },
      keyframes: {
        rise: {
          '0%': { opacity: '0', transform: 'translateY(22px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fl: {
          '0%': { transform: 'translate(0, 0) scale(1)' },
          '100%': { transform: 'translate(60px, -70px) scale(1.14)' },
        },
        morph: {
          '0%': { borderRadius: '58% 42% 55% 45% / 50% 56% 44% 50%' },
          '100%': { borderRadius: '46% 54% 42% 58% / 58% 44% 56% 42%' },
        },
        bob: {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-16px)' },
        },
        flow: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'theme-ripple': {
          '0%': { width: '0', height: '0', opacity: '0.6', transform: 'translate(-50%, -50%)' },
          '100%': { width: '200px', height: '200px', opacity: '0', transform: 'translate(-50%, -50%)' },
        },
        'path-draw': {
          '0%': { strokeDashoffset: '100%' },
          '100%': { strokeDashoffset: '0%' },
        },
        'pulse-ring': {
          '0%': { transform: 'scale(0.8)', opacity: '0.8' },
          '50%': { transform: 'scale(1.15)', opacity: '0.4' },
          '100%': { transform: 'scale(0.8)', opacity: '0.8' },
        },
        'pathway-drift': {
          '0%': { transform: 'translateY(0)' },
          '100%': { transform: 'translateY(-4px)' },
        },
        'shine': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'twinkle': {
          '0%, 100%': { opacity: '0.3', transform: 'scale(0.8)' },
          '50%': { opacity: '1', transform: 'scale(1.2)' },
        },
      },
      animation: {
        rise: 'rise 1s ease-out forwards',
        'fl-1': 'fl 20s ease-in-out infinite alternate',
        'fl-2': 'fl 20s ease-in-out -7s infinite alternate',
        'fl-3': 'fl 20s ease-in-out -12s infinite alternate',
        morph: 'morph 11s ease-in-out infinite alternate',
        bob: 'bob 6s ease-in-out infinite alternate',
        flow: 'flow 22s linear infinite',
        'theme-ripple': 'theme-ripple 600ms ease-out forwards',
        'path-draw': 'path-draw 1.8s ease-out forwards',
        'pulse-ring': 'pulse-ring 2.4s ease-in-out infinite',
        'pathway-drift': 'pathway-drift 4s ease-in-out infinite alternate',
        shine: 'shine 3s ease-in-out infinite',
        twinkle: 'twinkle 3s ease-in-out infinite',
      },
    },
  },
  plugins: [],
}

export default config
