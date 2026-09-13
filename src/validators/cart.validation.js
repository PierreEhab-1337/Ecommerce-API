import Joi from "joi";

export const addItemSchema = Joi.object({
  productId: Joi.string().length(24).hex().required().messages({
    "string.length": "Invalid product ID",
    "string.hex": "Invalid product ID",
    "any.required": "Product ID is required",
  }),
  quantity: Joi.number().integer().min(1).default(1).messages({
    "number.min": "Quantity must be at least 1",
  }),
});