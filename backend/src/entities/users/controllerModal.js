import { enums } from '../../utils/index.js';
import controller from './controller.js';
import validations from './validations.js';

const entityName = 'users';

const getUsersById = {
	action: controller.getUsersById,
	method: enums.methods.GET,
	schemas: validations.getUsersByIdSchemas,
	path: `${entityName}/${controller.getUsersById.name}/:userId`
};

const addUser = {
	action: controller.addUser,
	method: enums.methods.POST,
	schemas: validations.addUserSchemas,
	path: `${entityName}/${controller.addUser.name}/:id`
};

const updateUserById = {
	action: controller.updateUserById,
	method: enums.methods.PUT,
	schemas: validations.updateUserByIdSchemas,
	params: { id: 123 }
};

const deleteUserById = {
	action: controller.deleteUserById,
	method: enums.methods.DELETE,
	schemas: validations.deleteUserByIdSchemas,
	path: `${entityName}/:userId/${controller.deleteUserById.name}/:id`
};

export default { getUsersById, addUser, updateUserById, deleteUserById };
