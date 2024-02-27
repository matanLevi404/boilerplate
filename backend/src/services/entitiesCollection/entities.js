const getEntities = async () => ({
	users: (await import('C:/Users/97252/Desktop/learnings/boiler-plate/backend/src/entities/users/index.js')).default
}); 

export default getEntities();
