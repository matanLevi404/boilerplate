import chalk from 'chalk';

class TeardownPlugin {
	apply(jestHooks) {
		jestHooks.onTestRunComplete(() => {
			console.log('\n', chalk.grey(' > Press'), chalk.greenBright('g'), chalk.grey('to gracefully stop tests.'));
		});
	}

	getUsageInfo() {
		return {
			key: 'g',
			prompt: 'gracefully stop tests'
		};
	}

	async run(_globalConfig, _updateConfigAndRun) {
		console.log('\nRunning teardown...');
		await global.app.close(() => {
			console.log('Server is closing...');
			console.log('Exiting...');
			process.exit();
		});
		delete global.app;
		delete global.isServerUp;
	}
}

export default TeardownPlugin;
