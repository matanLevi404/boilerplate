import express from 'express';
import { jsonBodyParser, corsPolicy, apiResponses, apiRoutes } from './middlewares.js';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import swagger from '../services/swagger/swagger.js';

const initApp = () => {
	const app = express();
	app.use(corsPolicy);
	app.use('/', jsonBodyParser);
	app.use('/api', jsonBodyParser, apiRoutes(), apiResponses());
	app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(swagger.swaggerConfig)));
	return app;
};

export { initApp };
