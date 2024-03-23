import express from 'express';
import cors from 'cors';
import _ from 'lodash';
import chalk from 'chalk';
import { AppError, enums } from '../utils/index.js';
import entitiesCollection from '../services/entitiesCollection/entitiesCollection.js';
import en from '../../local/index.js';

const corsPolicy = cors({ origin: '*', methods: _.map(enums.methods, (value, _key) => _.upperCase(value)), credentials: true });

const jsonBodyParser = express.json({ limit: '50mb' });

const apiRoutes = () => {
	const router = express.Router();
	const { entities } = entitiesCollection;
	_.forEach(entities, ({ entityName, controllerModal }) => {
		_.forEach(controllerModal, (value, key) => {
			const path = value?.path ?? `${entityName}/${key}`;
			const schemas = value?.schemas;
			_.isEmpty(schemas)
				? router[value.method](`/${path}`, executeControllerFunction({ action: value.action }))
				: router[value.method](`/${path}`, controllerValidation(schemas), executeControllerFunction({ action: value.action }));
		});
	});
	return router;
};

const apiResponses = () => {
	const router = express.Router();
	router.all('*', (request, response, _next) => {
		const preMadeResponse = request.preMadeResponse || {};
		switch (preMadeResponse.type) {
			case 'html':
				return response.render(preMadeResponse.view, preMadeResponse.dataForHtml ?? []);
			case 'json':
				return response.status(200).json({ success: true, data: preMadeResponse.responseObj, sessionId: preMadeResponse.sessionId });
			case 'image/gif': {
				const image = Buffer.from(preMadeResponse.responseObj, 'base64');
				return response.writeHead(200, { 'Content-Type': 'image/png', 'Content-Length': image.length }).end(image);
			}
			default:
				return console.error(`The response of '${request.path}' is not set up correctly.`);
		}
	});
	return router;
};

const executeControllerFunction = ({ action }) => {
	return async (request, response, next) => {
		await action(request, response, (error, responseObj) => {
			request.preMadeResponse = { type: response.dataType || 'json', responseObj };
			next(error);
		});
	};
};

const controllerValidation = ({ body = null, params = null, query = null, headers = null }) => {
	return (request, _response, next) => {
		try {
			const { body: requestBody, params: requestParams, query: requestQuery } = request;
			if (_.size(requestBody) && !body) {
				console.warn(chalk.yellowBright(en.app.validations.controllers.body));
			}
			if (_.size(requestParams) && !params) {
				console.warn(chalk.yellowBright(en.app.validations.controllers.params));
			}
			if (_.size(requestQuery) && !query) {
				console.warn(chalk.yellowBright(en.app.validations.controllers.query));
			}
			body ? body.parse(request.body) : null;
			params ? params.parse(request.params) : null;
			query ? query.parse(request.query) : null;
			headers ? headers.parse(request.headers) : null;
			next();
		} catch (error) {
			const validationError = new AppError({
				name: en.app.validations.error.name,
				httpCode: 400,
				description: en.app.validations.error.description,
				extraDetails: error.issues
			});
			next(validationError);
		}
	};
};

const errorHandler = async (error, _request, response, _next) => {
	const { httpCode } = error;
	response.status(httpCode).send(error);
};

export { jsonBodyParser, corsPolicy, apiRoutes, apiResponses, errorHandler };
