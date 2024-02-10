const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { ValidationError } = require('express-validation');

const { logs } = require('./vars');
const logger = require('./logger');
const routes = require('../routes/v1');
const vars = require('./vars');

const app = express();

// request logging. dev: console | production: file
app.use(morgan(logs));

// parse body params and attache them to req.body
app.use(bodyParser.json());

app.use('/api', routes);

app.use((req, res, next) => {
  res.status(404).json({ message: 'Route not found' });
});

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    res.status(err.statusCode).json(err);
    return;
  }

  logger.error(err.stack);
  const response = { message: 'Something went wrong', statusCode: 500 };
  if (vars.env === 'development') {
    response.stack = err.stack;
  }
  res.status(500).json(response);
});

module.exports = app;
