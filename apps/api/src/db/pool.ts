import 'dotenv/config';
import { Pool } from 'pg';

// Configuración de base de datos
const DATABASE_CONFIG = {
	host: process.env.DB_HOST || 'localhost',
	port: parseInt(process.env.DB_PORT || '5432'),
	user: process.env.DB_USER || 'postgres',
	password: process.env.DB_PASSWORD || 'password',
	database: process.env.DB_NAME || 'frankman_task_fast',
	url: process.env.DATABASE_URL || `postgresql://${process.env.DB_USER || 'postgres'}:${process.env.DB_PASSWORD || 'password'}@${process.env.DB_HOST || 'localhost'}:${process.env.DB_PORT || '5432'}/${process.env.DB_NAME || 'frankman_task_fast'}`,
};

export const pool = new Pool({
	connectionString: DATABASE_CONFIG.url,
	ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.on('connect', () => {
	console.log('📦 Connected to PostgreSQL database');
});

pool.on('error', (err) => {
	console.error('❌ Database connection error:', err);
});
