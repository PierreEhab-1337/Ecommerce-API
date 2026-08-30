export default function asyncHandler(fn) {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
}


export const createError = (message, statusCode) => {
    const error = new Error(message)

    error.statusCode = statusCode
    error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    error.isOperational = true

    return error
}