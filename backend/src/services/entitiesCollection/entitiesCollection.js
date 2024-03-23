import fs from 'fs';
import _ from 'lodash';
import path, { dirname } from 'path';
import { files } from '../../utils/index.js';
import { fileURLToPath } from 'url';

const currentFileURL = import.meta.url;
const currentFilePath = fileURLToPath(currentFileURL);
const __dirname = dirname(currentFilePath);

class EntitiesCollection {
	entities = {};

	#buildBackendEntitiesFile = () => {
		let entitiesFile = 'const getEntities = async () => ({\n';
		_.each(this.entities, (entity) => {
			const entityPath = _.replace(entity.path, /\\/g, '/');
			const importScript = `(await import('${entityPath}')).default`;
			entitiesFile += `\t${entity.entityName}: ${importScript},\n`;
		});
		entitiesFile = `${_.trimEnd(entitiesFile, '\n,')}\n}); \n\nexport default getEntities();\n`;
		const path = files.getFilePath('/src/services/entitiesCollection/entities.js');
		fs.writeFileSync(path, entitiesFile);
	};

	getAllBackendEntities = async () => {
		const entitiesPaths = files.globFiles('./src/entities/*/**/index.js');
		return await entitiesPaths.reduce(async (accPromise, entityPath) => {
			const result = await accPromise;
			const relativePath = `./${path.relative(__dirname, entityPath)}`;
			const entity = (await import(relativePath)).default;
			entity.path = entityPath;
			result[entity.entityName] = entity;
			return result;
		}, Promise.resolve({}));
	};

	init = async () => {
		console.time('EntitiesCollection Init');
		const entities = await this.getAllBackendEntities();
		this.entities = entities;
		console.timeEnd('EntitiesCollection Init');
	};
}

const entitiesCollection = new EntitiesCollection();

export default entitiesCollection;
