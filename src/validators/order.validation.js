import Joi from "joi";

const orderIdSchema = Joi.object({
  id: Joi.string()
    .length(24)
    .hex()
    .required(),
});

const validateOrderId = (req, res, next) => {
  const { error } = orderIdSchema.validate(req.params);

  if (error) {
    return res.status(400).json({
      success: false,
      message: "Invalid order ID",
    });
  }

  next();
};

export default validateOrderId;