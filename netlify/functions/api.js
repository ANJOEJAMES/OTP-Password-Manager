const serverless = require('serverless-http');
const app = require('../../backend/server');

// Wrap the Express app so it can run as a Netlify Serverless Function
module.exports.handler = serverless(app);
