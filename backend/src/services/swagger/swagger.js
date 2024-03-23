import fs from 'fs';
import _ from 'lodash';
import entitiesCollection from '../entitiesCollection/entitiesCollection.js';
import { zodToJsonSchema } from 'zod-to-json-schema';

const packageJSON = JSON.parse(fs.readFileSync('package.json'));

class Swagger {
	swaggerConfig = {
		definition: {
			openapi: '3.1.0',
			info: {
				title: 'Bank Backend: REST API Docs',
				version: packageJSON.version
			},
			servers: [
				{
					url: 'http://localhost:3000'
				}
			],
			components: {
				securitySchemas: {
					bearerAuth: {
						type: 'http',
						scheme: 'bearer',
						bearerFormat: 'jwt'
					}
				}
			},
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
					const schemas = value?.schemas;
					const path = {
						[value.method]: {
							summary: _.startCase(key),
							tags: [entityName],
							parameters: this.#buildSwaggerParameters(schemas),
							requestBody: this.#buildRequestBody(schemas),
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

	#buildSwaggerParameters = ({ params, query }) => {
		const parameters = [...this.#buildRequestParams({ params }), ...this.#buildRequestParams({ query })];
		return _.compact(parameters);
	};

	#buildRequestBody = ({ body = null }) => {
		if (!_.size(body)) {
			return null;
		}
		const adaptedBody = _.omit(zodToJsonSchema(body), ['additionalProperties', '$schema']);
		return {
			required: false,
			content: {
				'application/json': {
					schema: adaptedBody
				}
			}
		};
	};

	#adaptProperties = ({ properties }) => {
		if (!_.isObject(properties) || _.isNull(properties)) {
			return;
		}
		return _.transform(
			properties,
			(adaptedProperties, value, key) => {
				const type = value.type;
				const isObject = type === 'object';
				const property = _.isArray(type) ? { oneOf: _.map(type, (type) => ({ type })) } : { type: type };
				adaptedProperties[key] = isObject ? { type: 'object', properties: this.#adaptProperties({ properties: value.properties }) } : property;
				return adaptedProperties;
			},
			{}
		);
	};

	#buildRequestParams = ({ params, query }) => {
		if (!params && !query) {
			return [];
		}
		const { properties } = params ? zodToJsonSchema(params) : zodToJsonSchema(query);
		return _.transform(
			properties,
			(result, value, key) => {
				const param = {
					in: params ? 'path' : 'query',
					name: key,
					schema: { type: value?.type }
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
		console.timeEnd('Swagger Init');
	};
}

const swagger = new Swagger();

export default swagger;
