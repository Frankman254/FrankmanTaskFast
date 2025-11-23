import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { pool } from './db/pool';
// import { pool } from './db/pool.js';

export const app = express();

// Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Health check
app.get('/health', (_req, res) => {
	res.json({
		status: 'ok',
		timestamp: new Date().toISOString(),
		message: 'API is running correctly',
	});
});
// Database test endpoint
app.get('/api/test-db', async (_req, res) => {
	try {
		const result = await pool.query(
			'SELECT NOW() as current_time, version() as postgres_version'
		);
		res.json({
			status: 'success',
			message: 'Database connection successful',
			data: result.rows[0],
		});
	} catch (error) {
		console.error('Database test error:', error);
		res.status(500).json({
			status: 'error',
			message: 'Database connection failed',
			error: error instanceof Error ? error.message : 'Unknown error',
		});
	}
});

// 404 handler
app.use('*', (_req, res) => {
	res.status(404).json({ error: 'Route not found' });
});

// Error handler
app.use(
	(
		err: Error,
		_req: express.Request,
		res: express.Response,
		_next: express.NextFunction
	) => {
		console.error(err.stack);
		res.status(500).json({ error: 'Something went wrong!' });
	}
);
