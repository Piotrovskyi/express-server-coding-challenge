const { Joi } = require('express-validation');

module.exports = {
  getAllUsers: {
    query: Joi.object({
      page: Joi.number().min(1),
      limit: Joi.number().min(1).max(100),
    }),
  },
  createUser: {
    body: Joi.object({
      name: Joi.string().max(255).required(),
      age: Joi.number().required(),
      location: Joi.string().max(255).required(),
    }),
  },
};
