import createError from "../utils/createError.js";

const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    const message = error.details.map((detail) => detail.message).join(', ');
    return next(createError(message, 400));
  }

  next();
};

export default validate;