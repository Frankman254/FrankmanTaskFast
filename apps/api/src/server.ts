import 'dotenv/config';
import { app } from './app.js';

// Configuración del servidor
const SERVER_CONFIG = {
	port: parseInt(process.env.BACKEND_PORT || '3001'),
	host: process.env.HOST || 'localhost',
};

const APP_CONFIG = {
	name: process.env.APP_NAME || 'FrankmanTaskFast',
};

app.listen(SERVER_CONFIG.port, SERVER_CONFIG.host, () => {
	console.log(`🚀 ${APP_CONFIG.name} API running on http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}`);
	console.log(`📊 Health check: http://${SERVER_CONFIG.host}:${SERVER_CONFIG.port}/health`);
});
