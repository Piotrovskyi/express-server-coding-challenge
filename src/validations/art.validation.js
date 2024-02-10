const { Joi } = require('express-validation');

const artID = Joi.number().required();

module.exports = {
  getArtById: {
    params: Joi.object({
      artID,
    }),
  },
  getAllArts: {
    query: Joi.object({
      page: Joi.number().min(1),
      limit: Joi.number().min(1).max(100),
    }),
  },
  createArtComment: {
    params: Joi.object({
      artID,
    }),
    body: Joi.object({
      userID: Joi.number(),
      name: Joi.alternatives().conditional('userID', {
        is: Joi.exist(),
        then: Joi.string().max(255),
        otherwise: Joi.string().max(255).required(),
      }),
      content: Joi.string().max(5000).required(),
    }),
  },

};
