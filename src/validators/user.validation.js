import Joi from "joi";
export const updateUserValidation = Joi.object({

    username: Joi.string().min(3).max(30),
   
   
    phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).messages({
        'string.pattern.base': 'Please enter a valid Egyptian phone number (e.g., 010xxxxxxxx)'
    }),
 
    avatar: Joi.string().trim()

});

export const createUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).messages({
        'string.pattern.base': 'Please enter a valid Egyptian phone number (e.g., 010xxxxxxxx)'
    }),
    role: Joi.string().valid('customer', 'admin').default('customer')
});

export const idParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});