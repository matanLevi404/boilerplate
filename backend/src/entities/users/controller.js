const getUsersById = async (request, _response, next) => {
	const { userId } = request.params;
	const { id, name } = request.query;
	next(null, { id, userId, name });
};

const addUser = async (request, _response, next) => {
	const { username, email } = request.body;
	next(null, { username, email });
};

const updateUserById = async (request, _response, next) => {
	const { username, email } = request.body;
	next(null, { username, email });
};

const deleteUserById = async (request, _response, next) => {
	const { id, userId } = request.params;
	next(null, { id, userId });
};

export default { getUsersById, addUser, updateUserById, deleteUserById };
