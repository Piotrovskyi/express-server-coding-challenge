const { database } = require('./vars');

// Database configuration required for sequelize
const config = {
  development: database,
  test: database,
  production: database,
};

module.exports = config;
