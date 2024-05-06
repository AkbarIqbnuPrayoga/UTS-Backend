const express = require('express');

const authentication = require('./components/authentication/authentication-route');
const users = require('./components/users/users-route');
const market = require('./components/market/market-route');

module.exports = () => {
  const app = express.Router();

  authentication(app);
  users(app);
  market(app);


  return app;
};
