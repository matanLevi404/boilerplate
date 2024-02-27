import entitiesCollection from './entitiesCollection/entitiesCollection.js';
import swagger from './swagger/swagger.js';

const initServices = async () => {
	console.time('## Services initiated in');
	console.log('___________________________________');

	await entitiesCollection.init();
	await swagger.init();
	console.timeEnd('## Services initiated in');
	console.log('___________________________________');
};

export { initServices };
