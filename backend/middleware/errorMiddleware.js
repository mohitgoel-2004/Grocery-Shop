const ApiError = require("../utils/apiError");

const notFound = (req, res, next) => {
	next(new ApiError(404, `Route not found: ${req.originalUrl}`));
};

const errorHandler = (err, req, res, next) => {
	const statusCode = err.statusCode || 500;
	const message = err.message || "Internal Server Error";

	if (res.headersSent) {
		return next(err);
	}

	res.status(statusCode).json({
		success: false,
		message,
		errors: err.errors || undefined,
		stack: process.env.NODE_ENV === "production" ? undefined : err.stack,
	});
};

module.exports = {
	notFound,
	errorHandler,
};
