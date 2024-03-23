import http from 'http';
import chalk from 'chalk';
import Terminus from '@godaddy/terminus';
import { initApp } from '../app/app.js';
import { initServices } from '../services/index.js';
import healthChecksConfig from '../utils/healthCheck.js';

const setup = async () => {
	if (!global.isServerUp) {
		await initServices();
		const app = initApp();
		const server = http.createServer(app);
		const listeningPromise = new Promise((resolve, reject) => {
			server.on('listening', () => {
				const port = server.address()?.port;
				console.info(`Listening on port: ${port}`);
				console.log('Docs is available at:', chalk.greenBright(`http://localhost:${port}/docs`));
				global.app = server;
				global.isServerUp = true;
				resolve();
			});
			server.on('error', (error) => {
				reject(error);
			});
			Terminus.createTerminus(server, healthChecksConfig);
			server.listen(process.env.SERVER_PORT ?? 1000);
		});
		await listeningPromise;
	}
};

export default setup;
