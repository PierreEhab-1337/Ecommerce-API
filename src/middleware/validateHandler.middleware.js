import createError from "../utils/createError.js";

const validate = (schema, source = "body") =>
  (req, res, next) => {
    const { error, value } = schema.validate(req[source]);

    if (error) {
      const message = error.details.map((detail) => detail.message).join(", ");
      return next(createError(message, 400));
    }

    Object.assign(req[source], value);
    next();
  };

export default validate;
