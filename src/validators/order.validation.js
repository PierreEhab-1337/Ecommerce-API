import Joi from 'joi';

export const getMyOrdersSchema = Joi.object({
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).default(10),
  status: Joi.string()
    .valid(
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    )
    .optional(),
  paymentMethod:  Joi.string()
    .valid(
      "cash", 
      "stripe", 
      "paypal", 
      "paymob"
    ).optional(),
  paymentStatus:  Joi.string()
    .valid(
      "pending", 
      "paid", 
      "failed", 
      "refunded"
    ).optional(),
});

export const orderIdSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required(),
});

export const updateOrderStatusSchema = Joi.object({
  status: Joi.string()
    .valid(
      'pending',
      'confirmed',
      'processing',
      'shipped',
      'delivered',
      'cancelled',
      'returned'
    ).required(),
  adminNote: Joi.string().max(1000).optional(),
});
