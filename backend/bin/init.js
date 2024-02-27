import 'dotenv/config.js';
import http from 'http';
import { initApp } from '../src/app/app.js';
import Terminus from '@godaddy/terminus';
import healthChecksConfig from '../src/utils/healthCheck.js';

const main = async () => {
	const app = initApp();
	const server = http.createServer(app);
	server.on('listening', () => {
		console.info(`Listening on port: ${server.address()?.port}`);
		console.info(`Docs is available at http://localhost:${server.address()?.port}/docs`);
	});
	Terminus.createTerminus(server, healthChecksConfig);
	server.listen(process.env.SERVER_PORT ?? 1000);
};

main();
