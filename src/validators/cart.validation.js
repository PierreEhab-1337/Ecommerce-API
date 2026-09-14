import Joi from "joi";

export const updateCartItemSchema = Joi.object({
    productId: Joi.string().required(),
    quantity: Joi.number().integer().min(1).required(),
});

export const removeCartItemParamSchema = Joi.object({
    productId: Joi.string().required(),
});
