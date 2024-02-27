import fs from 'fs';
import _ from 'lodash';
import entitiesCollection from '../entitiesCollection/entitiesCollection.js';
import { files } from '../../utils/index.js';

const packageJSON = JSON.parse(fs.readFileSync('package.json'));

class Swagger {
	swaggerConfig = {
		definition: {
			openApi: '3.0.0',
			info: {
				title: 'Bank Backend: REST API Docs',
				version: packageJSON.version
			},
			components: {
				securitySchemas: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'jwt'
					}
				}
			},
			security: [
				{
					bearerAuth: []
				}
			],
			paths: {
				'/healthcheck': {
					get: {
						tags: ['health'],
						summary: 'Health Check',
						description: 'Check the health status of the API',
						responses: {
							200: {
								description: 'API is healthy'
							}
						}
					}
				}
			}
		},
		apis: []
	};

	#buildSwaggerPaths = ({ entities }) => {
		return _.transform(
			entities,
			(result, { entityName, controllerModal }) => {
				_.forEach(controllerModal, (value, key) => {
					const routePath = value?.path ? this.#getRoutePath({ path: value?.path }) : `${entityName}/${key}`;
					const path = {
						[value.method]: {
							summary: _.startCase(key),
							tags: [entityName],
							parameters: this.#buildSwaggerParameters({ body: value?.body, params: value?.params, query: value?.query }),
							responses: {
								200: {
									description: value?.description ?? _.startCase(key)
								},
								400: {
									description: `Bad request: failed to ${_.startCase(key)}`
								}
							}
						}
					};
					result[`/api/${routePath}`] = path;
				});
			},
			{}
		);
	};

	#getRoutePath = ({ path }) => {
		const segments = path.split('/');
		const convertedSegments = segments.map((segment) => {
			return segment.startsWith(':') ? `{${segment.slice(1)}}` : segment;
		});
		const convertedPath = convertedSegments.join('/');
		return convertedPath;
	};

	#buildSwaggerParameters = ({ body, params, query }) => {
		const parameters = [this.#buildRequestBody({ body }), ...this.#buildRequestParams({ params }), ...this.#buildRequestParams({ query })];
		return _.compact(parameters);
	};

	#buildRequestBody = ({ body }) => {
		if (!_.size(body)) {
			return null;
		}
		const properties = _.transform(
			body,
			(result, value, key) => {
				result[key] = { type: typeof value };
			},
			{}
		);
		return {
			in: 'body',
			name: 'body',
			required: false,
			schema: {
				properties
			}
		};
	};

	#buildRequestParams = ({ params, query }) => {
		return _.transform(
			params ?? query,
			(result, value, key) => {
				const param = {
					in: params ? 'path' : 'query',
					name: key,
					schema: { type: typeof value },
					example: value
				};
				result.push(param);
			},
			[]
		);
	};

	init = async () => {
		console.time('Swagger Init');
		const { entities } = entitiesCollection;
		const paths = this.swaggerConfig.definition.paths;
		this.swaggerConfig.definition.paths = { ...paths, ...this.#buildSwaggerPaths({ entities }) };
		const path = files.getFilePath('/src/services/swagger/swagger.json');
		fs.writeFileSync(path, JSON.stringify(this.swaggerConfig.definition, null, 2), 'utf-8');
		console.timeEnd('Swagger Init');
	};
}

const swagger = new Swagger();

export default swagger;
