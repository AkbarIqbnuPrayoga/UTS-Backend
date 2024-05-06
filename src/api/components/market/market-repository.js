const { Market } = require('../../../models');

/** 
 * Count product based on query
 * @param {Object} query
 * @returns {Promise}
 */
async function countMarket(query) {
  return Market.countDocuments(query);
}

/**
 * Get product based on query
 * @param {Object} query - fungsi query
 * @param {Object} sorting - fungsi sorting
 * @param {number} skip - fungsi skip
 * @param {number} limit - fungsi limit
 * @returns {Promise}
 */
async function marketProducts(query, sorting, skip, limit) {
  return Market.find(query).sort(sorting).skip(skip).limit(limit);
}

/**
 * get product by id in market
 * @param {string} id - Item ID
 * @returns {Promise}
 */
async function marketProduct(id){
  return Market.findById(id);
}

/**
 * create product
 * @param {string} name - name
 * @param {string} category - category
 * @param {string} description - description
 * @param {number} price - price
 * @returns {Promise}
 */
async function createProduct(name, category, description, price) {
  return Market.create({ name, category, description, price });
}

// update products
/** 
* Update existing user
* @param {string} id - User ID
* @param {string} name - Name
* @param {string} category - category
* @param {string} description - description
* @param {number} price - price
* @returns {Promise}
*/
async function updateProduct(id, name, category, description, price){
  return Market.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        category,
        description,
        price,
      },
    }
  );
}


// delete product
/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteProduct(id){
  return Market.deleteOne({ _id: id});
}


module.exports = {
  marketProducts,
  marketProduct,
  countMarket,
  createProduct,
  updateProduct,
  deleteProduct,
};