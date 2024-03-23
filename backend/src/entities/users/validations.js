import z from 'zod';

const getUsersByIdSchemas = () => {
	const params = z.object({
		userId: z.string().regex(/\d+/)
	});
	const query = z.object({
		id: z.string(),
		name: z.string()
	});
	return { params, query };
};

const addUserSchemas = () => {
	const body = z.object({
		username: z.union([z.string(), z.number()]),
		email: z.string(),
		extra: z.object({
			details: z.boolean(),
			indet: z.object({
				done: z.null()
			})
		})
	});
	const params = z.object({
		id: z.union([z.number(), z.string()])
	});
	return { body, params };
};

const updateUserByIdSchemas = () => {
	const body = z.object({
		username: z.number(),
		email: z.string()
	});
	return { body };
};

const deleteUserByIdSchemas = () => {
	const params = z.object({
		userId: z.number(),
		id: z.number()
	});
	return { params };
};

export default {
	getUsersByIdSchemas: getUsersByIdSchemas(),
	addUserSchemas: addUserSchemas(),
	updateUserByIdSchemas: updateUserByIdSchemas(),
	deleteUserByIdSchemas: deleteUserByIdSchemas()
};
