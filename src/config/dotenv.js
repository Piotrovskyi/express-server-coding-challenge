const path = require('path');
const dotenv = require('dotenv');

// import .env variables
dotenv.config({
  path: path.join(__dirname, '../../.env'),
  example: path.join(__dirname, '../../.env.example'),
});
