class AppError extends Error {
	name;
	httpCode;
	isOperational;
	extraDetails;

	constructor({ name, httpCode = 500, description, isOperational = false, extraDetails = null }) {
		super(description);

		Object.setPrototypeOf(this, new.target.prototype);

		this.name = name;
		this.httpCode = httpCode;
		this.isOperational = isOperational;
		this.description = description;
		this.extraDetails = extraDetails;

		Error.captureStackTrace(this);
	}
}

export default AppError;
