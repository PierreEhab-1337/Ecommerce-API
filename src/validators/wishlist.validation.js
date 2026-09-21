import Joi from 'joi';

export const getAllWishlistSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
});

export const wishlistIdSchema = Joi.object({
  productId: Joi.string()
    .length(24)
    .hex()
    .required(),
});