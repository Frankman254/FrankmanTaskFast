import type { Config } from 'tailwindcss';

export default {
	content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
	darkMode: 'class',
	theme: {
		extend: {
			fontFamily: {
				sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
			},
			colors: {
				surface: {
					primary: 'var(--color-bg-primary)',
					secondary: 'var(--color-bg-secondary)',
					tertiary: 'var(--color-bg-tertiary)',
					hover: 'var(--color-bg-hover)',
				},
				content: {
					primary: 'var(--color-text-primary)',
					secondary: 'var(--color-text-secondary)',
					tertiary: 'var(--color-text-tertiary)',
				},
				accent: {
					DEFAULT: 'var(--color-accent)',
					hover: 'var(--color-accent-hover)',
					light: 'var(--color-accent-light)',
				},
				danger: {
					DEFAULT: 'var(--color-danger)',
					hover: 'var(--color-danger-hover)',
				},
			},
		},
	},
	plugins: [],
} satisfies Config;
