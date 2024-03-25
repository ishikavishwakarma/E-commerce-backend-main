// errorMiddleware.js
function errorMiddleware(err, req, res, next) {
    let statusCode = err.statusCode || 500; // Default to 500 if statusCode is not provided
    let errorMessage = err.message || 'Internal Server Error';

    res.status(statusCode).json({
        success: false,
        message: errorMessage
    });
}

module.exports = errorMiddleware;
