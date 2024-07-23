const Joi = require('joi');

const schema = Joi.object({
  type: Joi.string().required(),
  name: Joi.string().required(),
  phoneNumber: Joi.string().length(12).required(),
  claimId: Joi.string().required(),
  claimType: Joi.string(),
  patientFullName: Joi.string(),
  caretakerContactNumber: Joi.string(),
  totalClaimAmount: Joi.string(),
});

module.exports = schema;
