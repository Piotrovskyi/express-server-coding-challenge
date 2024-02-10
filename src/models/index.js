const { sequelize, Sequelize } = require('../config/db');

const modelCreators = [
  require('./user.model'),
  require('./art.model'),
  require('./comment.model'),
];

// Initialize associations
modelCreators.forEach((modelCreator) => {
  modelCreator(sequelize, Sequelize);
});

Object.keys(sequelize.models).forEach((model) => {
  sequelize.models[model].associate(sequelize.models);
});

module.exports = sequelize.models;
