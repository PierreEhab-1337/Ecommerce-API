import Joi from "joi";

export const createProductSchema = Joi.object({
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

  // ----------------------------------------------- getProductByIdSchema ---------------------------------------------

export const getProductByIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

  // ----------------------------------------------- getProductsQuerySchema -------------------------------------------

export const getProductsQuerySchema = Joi.object({
    category:
        Joi.string().lowercase(),
    brand:
        Joi.string(),
    minPrice:
        Joi.number().min(0),
    maxPrice:
        Joi.number().min(0),
    page:
        Joi.number().integer().min(1),
    limit:
        Joi.number().integer().min(1).max(100),
    sort:
        Joi.string(),
});

// ----------------------------------------------- addReviewSchema -----------------------------------------------

export const addReviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().trim().max(1000).allow(""),
});


