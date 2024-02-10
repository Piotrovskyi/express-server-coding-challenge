const { connectDatabase } = require('./config/db');
const app = require('./config/express');
const { port, env } = require('./config/vars');
const logger = require('./config/logger');

connectDatabase();

app.listen(port, () => logger.info(`server started on port ${port} (${env})`));
