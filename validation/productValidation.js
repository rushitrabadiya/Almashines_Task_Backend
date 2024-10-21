const Joi = require("joi");

const addProductSchema = Joi.object({
  url: Joi.string().uri().required().messages({
    "string.uri": "Invalid URL format",
    "any.required": "URL is required",
  }),
});

exports.validateAddProduct = (data) => {
  const { error } = addProductSchema.validate(data);
  return error
    ? { isValid: false, message: error.details[0].message }
    : { isValid: true };
};
