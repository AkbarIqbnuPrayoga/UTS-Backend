const serviceMarket = require('./market-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * get all product in market
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function marketProducts(request, response, next){
  try {
      const { page_number, page_size, sort, search } = request.query;
      const marketplace = await serviceMarket.marketProducts(page_number, page_size, search, sort);
      return response.status(200).json(marketplace);
  } catch (error) {
      return next(error);
  }
}

/**
 * get product by id in market
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function marketProduct(request, response, next) {
  try {
    const product = await serviceMarket.getProduct(request.params.id);

    //jika id product tidak ada maka akan error
    if (!product) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Products ID Not Found in Marketplace'
      );
    }

    return response.status(200).json(product);
  } catch (error) {
    return next(error);
  }
}


/**
 * create product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createProduct(request, response, next) {
  try {
    const name = request.body.name;
    const category = request.body.category;
    const description = request.body.description;
    const price = request.body.price;

    const success = await serviceMarket.createProduct(name, category, description, price);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Create Product in Marketplace'
      );
    }

    return response.status(200).json({ name, category, description, price});
  } catch (error) {
    return next(error);
  }
}

/**
 * update product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateProduct(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const category = request.body.category;
    const description = request.body.description;
    const price = request.body.price;

    const success = await serviceMarket.updateProduct(id, name, category, description, price);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Update Product in Marketplace'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}


/**
 * delete product
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteProduct(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;

    const success = await serviceMarket.deleteProduct(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to Delete Product in Marketplace'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  marketProducts,
  marketProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};