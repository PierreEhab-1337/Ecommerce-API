import Joi from "joi";
export const updateUserValidation = Joi.object({

    username: Joi.string().min(3).max(30),
   
   
    phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).messages({
        'string.pattern.base': 'Please enter a valid Egyptian phone number (e.g., 010xxxxxxxx)'
    }),
 
    avatar: Joi.string().trim()

});
export const idParamSchema = Joi.object({
    id: Joi.string().length(24).required()
});