const joi = require("joi");

const registerValidation = (data) => {
  const schema = joi.object({
    username: joi.string().min(3).max(30).required(),
    email: joi.string().min(6).max(200).required().email(),
    password: joi.string().min(8).max(128).required(),
    role: joi.string().valid("student", "instructor").required(),
  });
  return schema.validate(data);
};

const loginValidation = (data) => {
  const schema = joi.object({
    email: joi.string().min(6).max(200).required().email(),
    password: joi.string().min(8).max(128).required(),
  });
  return schema.validate(data);
};

const courseValidation = (data) => {
  const schema = joi.object({
    title: joi.string().min(3).max(50).required(),
    description: joi.string().min(50).max(200).required(),
    price: joi.number().min(0).max(9999).required(),
  });
  return schema.validate(data);
};

module.exports = { registerValidation, loginValidation, courseValidation };
