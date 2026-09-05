const createError = (message, statusCode) => {
    const error = new Error(message)

    error.statusCode = statusCode
    error.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error'
    error.isOperational = true

    return error
}

export default createError;