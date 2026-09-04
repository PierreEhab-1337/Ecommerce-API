import Joi from 'joi';
const createUserSchema = Joi.object({
    username: Joi.string().min(3).max(30).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    phone: Joi.string().pattern(/^01[0125][0-9]{8}$/).required().messages({
        'string.pattern.base': 'Please enter a valid Egyptian phone number (e.g., 010xxxxxxxx)'
    }),
    role: Joi.string().valid('user', 'admin').default('user')
});

const idParamSchema = Joi.object({
    id: Joi.string().hex().length(24).required()
});


export const addUserValidation = (req, res, next) => {
    const { error } = createUserSchema.validate(req.body, { abortEarly: false });
    if (error) {
        const errorMessages = error.details.map(err => err.message);
        return res.status(400).json({ status: 'fail', errors: errorMessages });
    }
    next();
};


export const getUserValidation = (req, res, next) => {
    const { error } = idParamSchema.validate(req.params);
    if (error) {
        return res.status(400).json({ status: 'fail', error: error.details[0].message });
    }
    next();
};
