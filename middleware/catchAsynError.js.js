// catchAsyncError.js

const catchAsyncError = (fun) => (req, res, next) => {
    Promise.resolve(fun(req, res, next)).catch(next);
}

module.exports = catchAsyncError;