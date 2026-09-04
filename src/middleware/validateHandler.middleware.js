export const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const messages = error.details.map((d) => d.message);
    return res.status(400).json({ success: false, errors: messages });
  }
  next();
};
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
