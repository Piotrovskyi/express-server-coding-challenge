const path = require('path');
const dotenv = require('dotenv-safe');

// import .env variables
dotenv.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});

module.exports = {
  env: process.env.NODE_ENV,
  port: process.env.PORT,
  logs: process.env.NODE_ENV === 'production' ? 'combined' : 'dev',
  database: {
    test: {
      dialect: 'sqlite',
      storage: ':memory:',
      logging: false,
    },
    development: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      dialect: 'postgres',
    },
    production: {
      username: process.env.DATABASE_USERNAME,
      password: process.env.DATABASE_PASSWORD,
      database: process.env.DATABASE_NAME,
      host: process.env.DATABASE_HOST,
      port: process.env.DATABASE_PORT,
      dialect: 'postgres',
    }
  },
};
