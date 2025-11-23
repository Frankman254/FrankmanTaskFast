import path from 'path';

import react from '@vitejs/plugin-react';
import { defineConfig, loadEnv } from 'vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');

	return {
		plugins: [react()],
		resolve: {
			alias: {
				'@': path.resolve(__dirname, './src'),
				'@/components': path.resolve(__dirname, './src/components'),
				'@/hooks': path.resolve(__dirname, './src/hooks'),
				'@/contexts': path.resolve(__dirname, './src/contexts'),
				'@/types': path.resolve(__dirname, './src/types'),
				'@/lib': path.resolve(__dirname, './src/lib'),
			},
		},
		server: {
			port: parseInt(env.FRONTEND_PORT || '5173'),
			host: true,
			strictPort: true, // Falla si el puerto está ocupado
		},
		define: {
			__APP_NAME__: JSON.stringify(env.APP_NAME || 'FrankmanTaskFast'),
			__API_URL__: JSON.stringify(
				env.API_BASE_URL || 'http://localhost:3001'
			),
		},
	};
});
