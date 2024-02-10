const { Sequelize } = require('sequelize');
const logger = require('./logger');
const vars = require('./vars');
const databaseConfig = require('./database');

const sequelize = new Sequelize(databaseConfig[vars.env]);

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('Connection has been established successfully.');
  } catch (error) {
    logger.error('Unable to connect to the database:', error);
  }
}

module.exports = {
  sequelize,
  connectDatabase,
  Sequelize,
};
