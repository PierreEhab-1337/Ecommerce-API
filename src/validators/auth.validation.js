import Joi from 'joi';

export const registerSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.email': 'Please enter username',
    'any.required': 'username is required'
  }),
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  phone: Joi.string().optional()

})


export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Please enter a valid email address',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
});

///task3
export const forgetPasswordSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': "Please enter avalid email address",
    'any.required': "Email is required",
  })

});


export const verifyOTPSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': "Please enter avalid email address",
    'any.required': "Email is required",
  }),
  otp: Joi.string().required().length(6).messages({
    'any.required': 'OTP is required'
  }),

  newPassword: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  })

});
