import 'dotenv/config.js';
import http from 'http';
import { initApp } from '../src/app/app.js';
import Terminus from '@godaddy/terminus';
import { initServices } from '../src/services/index.js';
import healthChecksConfig from '../src/utils/healthCheck.js';
import chalk from 'chalk';

const main = async () => {
	await initServices();
	const app = initApp();
	const server = http.createServer(app);
	server.on('listening', () => {
		console.info(`Listening on port: ${server.address()?.port}`);
		const myCustomColor = chalk.rgb(97, 219, 251);
		console.log('Docs is available at:', myCustomColor(`http://localhost:${server.address()?.port}/docs`));
	});
	Terminus.createTerminus(server, healthChecksConfig);
	server.listen(process.env.SERVER_PORT ?? 1000);
};

main();
