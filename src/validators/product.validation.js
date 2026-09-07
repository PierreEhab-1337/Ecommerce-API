import Joi from "joi";

import createError from "../utils/createError.js";

const createProductSchema = Joi.object({
  name: Joi.string().trim().max(200).required(),

  shortDescription: Joi.string().trim().max(500).required(),

  description: Joi.string().trim().required(),
  
   shortDescription: Joi.string().trim().max(500).required(),

  price: Joi.number().positive().required(),

  discountPrice: Joi.number().positive().optional(),

  stock: Joi.number().integer().min(0).required(),

  sku: Joi.string().trim().max(50).required(),

  category: Joi.string().trim().required(),

  subcategory: Joi.string().trim().optional(),

  brand: Joi.string().trim().optional(),

  tags: Joi.array().items(Joi.string().trim()).optional()
});

const validateCreateProduct = (req, res, next) => {
  const { error } = createProductSchema.validate(req.body);

  if (error) {
    throw createError(error.details[0].message, 400);
  }

  next();
};

export default validateCreateProduct;