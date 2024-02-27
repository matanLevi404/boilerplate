import express from 'express';
import { jsonBodyParser, corsPolicy } from './middlewares.js';

const initApp = () => {
	const app = express();
	app.use(corsPolicy);
	app.use('/', jsonBodyParser);
	app.use('/api', jsonBodyParser);
	return app;
};

export { initApp };
