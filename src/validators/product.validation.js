import Joi from "joi";
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


