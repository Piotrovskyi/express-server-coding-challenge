const { Sequelize } = require('sequelize');
const logger = require('./logger');
const vars = require('./vars');

const sequelize = new Sequelize(
  vars.database[vars.env],
);

async function connectDatabase() {
  try {
    await sequelize.authenticate();
    // await sequelize.sync();
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
