import { createError } from '../utils/asyncHandler.js';

// معالجة خطأ الـ ID غير الصالح في Mongoose
const handleCastErrorDB = (err) => {
  return createError(` 'invalid value ' : ${err.path}: ${err.value}`, 400)
}

// معالجة أخطاء تكرار البيانات (مثل تكرار البريد الإلكتروني)
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg ? err.errmsg.match(/(["'])(\\?.)*?\1/)[0] : '';
  return createError(`email is taken already in the database ${value}`, 400)
}

// معالجة أخطاء التحقق من البيانات (Validation)
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message)
  return createError(`invalid data : ${errors.join(' . ')}`, 400)
};

// معالجة أخطاء توكن التوثيق JWT
const handleJWTError = () => createError(`Unauthorized!`, 401)
const handleJWTExpiredError = () => createError(`Your session has expired, Please log in again`, 401)

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  if (process.env.NODE_ENV === 'development') {
    res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    })

  } else {
    // بيئة الإنتاج
    let error = { ...err, message: err.message, name: err.name, code: err.code }

    if (error.name === 'CastError')
      error = handleCastErrorDB(error)
    if (error.code === 11000)
      error = handleDuplicateFieldsDB(error)
    if (error.name === 'ValidationError')
      error = handleValidationErrorDB(error)
    if (error.name === 'JsonWebTokenError')
      error = handleJWTError()
    if (error.name === 'TokenExpiredError')
      error = handleJWTExpiredError()

    res.status(error.statusCode || 500).json({
      status: error.status || 'error',
      message: error.isOperational ? error.message : 'internal server error',
    })
  }
}