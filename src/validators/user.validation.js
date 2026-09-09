import Joi from "joi";
export const updateUserValidation = Joi.object({

    username: Joi.string().min(3).max(30),
    email: Joi.string().email(),
   
    phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).messages({
        'string.pattern.base': 'Please enter a valid Egyptian phone number (e.g., 010xxxxxxxx)'
    }),
 
    avatar: Joi.string().trim()

});