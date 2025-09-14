// Configuraciones centralizadas para la aplicación

export const APP_CONFIG = {
	name: process.env.APP_NAME || 'FrankmanTaskFast',
	version: process.env.APP_VERSION || '1.0.0',
	description: process.env.APP_DESCRIPTION || 'Kanban-Gantt Project Management',
	author: process.env.APP_AUTHOR || 'Developer',
} as const;

export const DATABASE_CONFIG = {
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || 'password',
	database: process.env.DB_NAME || 'frankman_task_fast',
	url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'frankman_task_fast'}`,
} as const;

export const SERVER_CONFIG = {
	port: parseInt(process.env.BACKEND_PORT || '3001'),
	host: process.env.HOST || 'localhost',
	apiBaseUrl: process.env.API_BASE_URL || `http://localhost:${process.env.BACKEND_PORT || '3001'}`,
	frontendUrl: process.env.FRONTEND_URL || `http://localhost:${process.env.FRONTEND_PORT || '5173'}`,
	corsOrigin: process.env.CORS_ORIGIN || `http://localhost:${process.env.FRONTEND_PORT || '5173'}`,
} as const;

export const FRONTEND_CONFIG = {
	port: parseInt(process.env.FRONTEND_PORT || '5173'),
	apiBaseUrl: process.env.API_BASE_URL || `http://localhost:${process.env.BACKEND_PORT || '3001'}`,
} as const;

export const ENV_CONFIG = {
	nodeEnv: process.env.NODE_ENV || 'development',
	debug: process.env.DEBUG === 'true',
	sessionSecret: process.env.SESSION_SECRET || 'your-super-secret-session-key-here',
} as const;
