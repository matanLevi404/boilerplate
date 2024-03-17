import { enums } from '../../utils/index.js';
import controller from './controller.js';
import validations from './validations.js';

const entityName = 'users';

const getUsersById = {
	action: controller.getUsersById,
	method: enums.methods.GET,
	schemas: validations.getUsersByIdSchemas,
	query: { id: 15, name: 'John Doe' },
	params: { userId: 152 },
	path: `${entityName}/${controller.getUsersById.name}/:userId`
};

const addUser = {
	action: controller.addUser,
	method: enums.methods.POST,
	schemas: validations.addUserSchemas,
	body: { username: 'test', email: 'test@test.com' },
	params: { id: 1 },
	path: `${entityName}/${controller.addUser.name}/:id`
};

const updateUserById = {
	action: controller.updateUserById,
	method: enums.methods.PUT,
	schemas: validations.updateUserByIdSchemas,
	body: { username: 123, email: 'test@test.com' },
	params: { id: 123 }
};

const deleteUserById = {
	action: controller.deleteUserById,
	method: enums.methods.DELETE,
	schemas: validations.deleteUserByIdSchemas,
	params: { userId: 1, id: 123 },
	path: `${entityName}/:userId/${controller.deleteUserById.name}/:id`
};

export default { getUsersById, addUser, updateUserById, deleteUserById };
