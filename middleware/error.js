const ErrorHandler = require("../utils/ErrorHandler");

function errorMiddleware(err, req, res, next) {
    let statusCode = err.statusCode || 500; // Default to 500 if statusCode is not provided

    if (err.name === 'CastError') {
        statusCode = 400;
        err = new ErrorHandler('Invalid ID', statusCode);
    }

    if (err.code === 11000 && err.name === 'MongoError') {
        statusCode = 400;
        err = new ErrorHandler('Duplicate Key Error', statusCode);
    }

    if (err.name === 'JsonWebTokenError') {
        statusCode = 401;
        err = new ErrorHandler('Invalid JWT Token', statusCode);
    }

    if (err.name === 'TokenExpiredError') {
        statusCode = 401;
        err = new ErrorHandler('JWT Token Expired', statusCode);
    }

    res.status(statusCode).json({
        success: false,
        message: err.message
    });
}

module.exports = errorMiddleware;