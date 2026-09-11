import Joi from "joi";

const createProductSchema = Joi.object({
  name: Joi.string()
    .trim()
    .max(200)
    .required(),

  price: Joi.number()
    .min(0)
    .required(),

  shortDescription: Joi.string()
    .trim()
    .max(500)
    .required(),

  description: Joi.string()
    .trim()
    .required(),

  discountPrice: Joi.number()
    .min(0)
    .optional(),

  stock: Joi.number()
    .integer()
    .min(0)
    .required(),

  sku: Joi.string()
    .trim()
    .max(50)
    .optional(),

  category: Joi.string()
    .trim()
    .required(),

  subcategory: Joi.string()
    .trim()
    .optional(),

  brand: Joi.string()
    .trim()
    .optional(),

  tags: Joi.array()
    .items(Joi.string().trim())
    .optional(),

  featured: Joi.boolean()
    .optional(),

  isActive: Joi.boolean()
    .optional(),
});

const createProductValidation = (req, res, next) => {
  const { error } = createProductSchema.validate(req.body, {
    abortEarly: false,
  });

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Validation error",
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};

export default createProductValidation;