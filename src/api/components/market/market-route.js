const express = require('express');

const authenticationMiddleware = require('../../middlewares/authentication-middleware');
const celebrate = require('../../../core/celebrate-wrappers');
const marketController = require('./market-controller');
const marketValidator = require('./market-validator');

const route = express.Router();
 
module.exports = (app) => {
  app.use('/marketplace', route);

  route.get('/', authenticationMiddleware, marketController.marketProducts);


  // create Product
  route.post('/', authenticationMiddleware, celebrate(marketValidator.createProduct), marketController.createProduct);


  // Get user detail
  route.get('/:id', authenticationMiddleware, marketController.marketProduct);


  // Update user
  route.put('/:id', authenticationMiddleware, celebrate(marketValidator.updateProduct), marketController.updateProduct);

  // Delete user
  route.delete('/:id', authenticationMiddleware, marketController.deleteProduct);

};