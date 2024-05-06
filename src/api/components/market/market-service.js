const marketRepository = require('./market-repository');

/**
 * Get list of products
 * @returns {Array}
 */
async function marketProducts() {
  const market = await marketRepository.getProducts();

  const results = [];
  for (let i = 0; i < market.length; i += 1) {
    const marketItem = market[i];
    results.push({
      _id: marketItem._id,
      name: marketItem.name,
      category: marketItem.category,
      description: marketItem.description,
      price: marketItem.price,
    });
  }

  return results;
}

/** 3
 * Get list of product 
 * @param {integer} pageNumber - banyaknya page
 * @param {integer} pageSize - ukuran dari isi page
 * @param {string} search - search untuk mencari nama dan email dengan ascending dan descending
 * @param {string} sort - mensorting dengan descending atau ascending

 * @returns {Object}
 */
async function marketProducts(
  pageNumber = 1,
  pageSize = 10,
  search = '',
  sort = ''
) {
  let query = {};

  if (search) {
    const [productName, searchKey] = search.split(':');
    if (productName === 'name') {
      query[productName] = { $regex: searchKey, $options: 'i' };
    }
    else if(productName === 'category') {
      query[productName] = { $regex: searchKey, $options: 'i' };
    }
}

  let sorting = { name : 1 };
  if (sort) {
    const [sortName, sortsc] = sort.split(':');
    if (sortName === 'name')
      sortsc === 'asc' || sortsc === 'desc';
    {
      sorting[sortName] = sortsc === 'desc' ? -1 : 1;
    }
  }

  const count = await marketRepository.countMarket(query);
  const skip = (pageNumber - 1) * pageSize;
  const getMarket = await marketRepository.marketProducts(
    query,
    sorting,
    skip,
    pageSize
  );
  const total_pages = Math.ceil(count);
  const has_previous_page = pageNumber > 1;
  const has_next_page = pageNumber < total_pages;

  return {
    page_number: pageNumber,
    page_size: pageSize,
    count: getMarket.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data: getMarket,
  };
}

/**
 * Get product detail
 * @param {string} id - Products ID
 * @returns {Object}
 */
async function marketProduct(item_id) {
  const product = await marketRepository.marketProduct(item_id);

  // product not found
  if (!product) {
    return null;
  }

  return {
    item_id: products.item_id,
    name: products.name,
    description: products.description,
    price: products.price,
  };
}

/**
 * Create new product
 * @param {string} name - Name
 * @param {string} category - category
 * @param {string} description - Description
 * @param {number} price - Price
 * @returns {boolean}
 */
async function createProduct(name, category, description, price) {
  try {
    await marketRepository.createProduct(name, category, description, price);
    return true;
  } catch (err) {
    return false;
  }
}

// update products
/**
 * Update existing user
 * @param {string} _id - Item ID
 * @param {string} name - Name
 * @param {string} category - category
 * @param {string} description - description
 * @param {number} price - price
 * @returns {Promise}
 */
async function updateProduct(_id, name, category, description, price) {
  const product = await marketRepository.marketProduct(_id);

  // product not found
  if (!product) {
    return null;
  }

  try {
    await marketRepository.updateProduct(
      _id,
      name,
      category,
      description,
      price
    );
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} _id - product ID
 * @param {string} name - Name
 * @returns {boolean}
 */
async function deleteProduct(id) {
  const product = await marketRepository.marketProduct(id);

  // User not found
  if (!product) {
    return null;
  }

  try {
    await marketRepository.deleteProduct(id);
  } catch (err) {
    return null;
  }

  return true;
}

module.exports = {
  marketProducts,
  marketProduct,
  createProduct,
  updateProduct,
  deleteProduct,
};
