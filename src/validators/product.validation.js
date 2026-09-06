import Joi from "joi";
import createError from "../utils/createError.js";

const createProductSchema = Joi.object({
  name: Joi.string().trim().required(),

  description: Joi.string().trim().required(),

  price: Joi.number().positive().required(),

  category: Joi.string().trim().required(),

  stock: Joi.number().integer().min(0).required()
});

const validateCreateProduct = (req, res, next) => {

  const { error } = createProductSchema.validate(req.body);

  if (error) {
    throw createError(error.details[0].message, 400);
  }

  next();
};

export default validateCreateProduct;