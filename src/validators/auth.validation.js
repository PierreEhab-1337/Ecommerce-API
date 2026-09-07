import Joi from "joi";
import createError from "../utils/createError.js";

// =========================
// Register Schema
// =========================
const registerSchema = Joi.object({
  username: Joi.string()
    .trim()
    .min(2)
    .required(),

  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .min(6)
    .required(),

  phone: Joi.string()
    .trim()
    .optional(),

  role: Joi.string()
    .valid("admin", "customer")
    .default("customer"),
});

// =========================
// Login Schema
// =========================
const loginSchema = Joi.object({
  email: Joi.string()
    .trim()
    .lowercase()
    .email()
    .required(),

  password: Joi.string()
    .required(),
});

// =========================
// Register Validator
// =========================
export const validateRegister = (req, res, next) => {
  const { error, value } = registerSchema.validate(req.body);

  if (error) {
    throw createError(
      error.details[0].message,
      400
    );
  }

  req.body = value;

  next();
};

// =========================
// Login Validator
// =========================
export const validateLogin = (req, res, next) => {
  const { error, value } = loginSchema.validate(req.body);

  if (error) {
    throw createError(
      error.details[0].message,
      400
    );
  }

  req.body = value;

  next();
};

export default {
  validateRegister,
  validateLogin,
};
