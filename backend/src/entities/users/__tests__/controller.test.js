import supertest from 'supertest';
import controllerModal from '../controllerModal.js';
import { string } from '../../../utils/index.js';

describe('Users - tests', function () {
	const testName = string.parseVariableName(controllerModal.getUsersById.action.name);
	it(`Should ${testName}`, async () => {
		const response = await supertest(global.app).get('/api/users/getUsersById/456');
		expect(response.status).toStrictEqual(200);
	});
});
