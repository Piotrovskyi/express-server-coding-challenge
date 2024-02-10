const express = require('express');
const morgan = require('morgan');
const bodyParser = require('body-parser');
const { ValidationError } = require('express-validation');

const { logs } = require('./config/vars');
const { port, env } = require('./config/vars');
const logger = require('./config/logger');
const { connectDatabase } = require('./config/db');
const routes = require('./routes/v1');
const vars = require('./config/vars');

connectDatabase();

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
    return res.status(err.statusCode).json(err);
  }

  logger.error(err.stack);
  const response = { message: 'Something went wrong', statusCode: 500 };
  if (vars.env === 'development') {
    response.stack = err.stack;
  }
  res.status(500).json(response);
});

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
