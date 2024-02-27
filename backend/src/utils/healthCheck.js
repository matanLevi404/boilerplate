const serverStatus = { acceptRequests: true, servicesInitiated: false };

const isDev = process.env.NODE_ENV === 'development';

const healthChecksConfig = {
	healthChecks: {
		'/healthcheck': () => {
			if (serverStatus.acceptRequests) {
				return Promise.resolve();
			}
			return Promise.reject(new Error('server unavailable'));
		}
	},
	signals: ['SIGTERM', 'SIGINT', 'SIGUSR2'],
	beforeShutdown: async () => {
		serverStatus.acceptRequests = false;
		return new Promise((resolve) => setTimeout(resolve, isDev ? 100 : 10000));
	},
	onSignal: () => new Promise((resolve) => resolve())
};

export default healthChecksConfig;
