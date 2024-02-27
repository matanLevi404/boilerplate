import express from 'express';
import cors from 'cors';
import _ from 'lodash';
import { enums } from '../utils/index.js';
import entitiesCollection from '../services/entitiesCollection/entitiesCollection.js';

const corsPolicy = cors({ origin: '*', methods: _.map(enums.methods, (value, key) => _.upperCase(value)), credentials: true });

const jsonBodyParser = express.json({ limit: '50mb' });

const apiRoutes = () => {
	const router = express.Router();
	const { entities } = entitiesCollection;
	_.forEach(entities, ({ entityName, controllerModal }) => {
		_.forEach(controllerModal, (value, key) => {
			const path = value?.path ?? `${entityName}/${key}`;
			router[value.method](`/${path}`, executeControllerFunction({ action: value.action }));
		});
	});
	return router;
};

const apiResponses = () => {
	const router = express.Router();
	router.all('*', (request, response, next) => {
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

export { jsonBodyParser, corsPolicy, apiRoutes, apiResponses };
