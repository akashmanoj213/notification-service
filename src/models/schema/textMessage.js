const Joi = require('joi');

const schema = Joi.object({
    type: Joi.string()
        .required(),
    phoneNumber: Joi.string()
        .length(12)
        .required(),
    body: Joi.string()
        .required()
});

module.exports = schema;