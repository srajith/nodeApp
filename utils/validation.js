const Joi = require('joi');


const registerSchema = Joi.object({
    name: Joi.string()
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.empty': `Name cannot be an empty field`,
            'string.min': `Name should have a minimum length of {#limit} characters`,
            'any.required': `Name is a required field`
        }),
    username: Joi.string()
        .alphanum()
        .min(3)
        .max(20)
        .required()
        .messages({
            'string.empty': `Username cannot be an empty field`,
            'string.min': `Username should have a minimum length of {#limit} characters`,
            'any.required': `Username is a required field`
        }),

    password: Joi.string()
        .pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
        .required()
        .messages({
            'string.pattern.base': `Password cannot be a weak password`,
            'any.required': `Password is a required field`
        }),

});

module.exports = registerSchema;