import Joi from "joi";
  // ----------------------------------------------- getProductByIdSchema ---------------------------------------------

export const getProductByIdSchema = Joi.object({
  id: Joi.string().required(),
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


