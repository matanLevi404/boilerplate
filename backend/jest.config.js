const jestConfig = {
	maxConcurrency: 1,
	globalSetup: './src/jest/globalSetup.js',
	watchPathIgnorePatterns: ['./src/services/entitiesCollection/entities.js', './src/services/swagger/swagger.json'],
	watchPlugins: [['./src/jest/teardownPlugin.js']],
	testEnvironment: 'node',
	detectOpenHandles: true
};

export default jestConfig;
