const usersRepository = require('./users-repository');
const { hashPassword, passwordMatched } = require('../../../utils/password');

/**
 * Get list of users
 * @returns {Array}
 */
async function getUsers() {
  const users = await usersRepository.getUsers();

  const results = [];
  for (let i = 0; i < users.length; i += 1) {
    const user = users[i];
    results.push({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  }

  return results;
}

/** 3
 * Get list of users 
 * @param {integer} pageNumber - banyaknya page
 * @param {integer} pageSize - ukuran dari isi page
 * @param {string} search - search untuk mencari nama dan email dengan ascending dan descending
 * @param {string} sort - mensorting dengan descending atau ascending
 * @returns {Object}
 */
async function getUsers(page = 1, pageSize = 10 , search = '', sort = '') {
  let query = {};

  if (search) {
    const [EmailName, searchKey] = search.split(':');
    if (EmailName === 'email') {
      query[EmailName] = { $regex: searchKey, $options: 'i' };
    }
    else if (EmailName === 'name') {
      query[EmailName] = { $regex: searchKey, $options: 'i' };
    }
  }

  let sorting = {email: 1};
  if (sort) {
    const [sortName, sortsc] = sort.split(':');
    if ((sortName === 'email' || sortName === 'name')) 
        (sortsc === 'asc' || sortsc === 'desc'); {
      sorting[sortName] = sortsc === 'desc'? -1 : 1;
    }
  }
  

  const count = await usersRepository.countUsers(query);
  const skip = (page - 1) * pageSize;
  const users = await usersRepository.getUsers(query, sorting, skip, pageSize);
  const total_pages = Math.ceil(count);
  const has_previous_page = page > 1;
  const has_next_page = page < total_pages;

  return {
    page_number: page,
    page_size: pageSize,
    count: users.length,
    total_pages,
    has_previous_page,
    has_next_page,
    data: users,
  };
}


/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Object}
 */
async function getUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  return {
    id: user.id,
    name: user.name,
    email: user.email,
  };
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {boolean}
 */
async function createUser(name, email, password) {
  // Hash password
  const hashedPassword = await hashPassword(password);

  try {
    await usersRepository.createUser(name, email, hashedPassword);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {boolean}
 */
async function updateUser(id, name, email) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.updateUser(id, name, email);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Delete user
 * @param {string} id - User ID
 * @returns {boolean}
 */
async function deleteUser(id) {
  const user = await usersRepository.getUser(id);

  // User not found
  if (!user) {
    return null;
  }

  try {
    await usersRepository.deleteUser(id);
  } catch (err) {
    return null;
  }

  return true;
}

/**
 * Check whether the email is registered
 * @param {string} email - Email
 * @returns {boolean}
 */
async function emailIsRegistered(email) {
  const user = await usersRepository.getUserByEmail(email);

  if (user) {
    return true;
  }

  return false;
}

/**
 * Check whether the password is correct
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function checkPassword(userId, password) {
  const user = await usersRepository.getUser(userId);
  return passwordMatched(password, user.password);
}

/**
 * Change user password
 * @param {string} userId - User ID
 * @param {string} password - Password
 * @returns {boolean}
 */
async function changePassword(userId, password) {
  const user = await usersRepository.getUser(userId);

  // Check if user not found
  if (!user) {
    return null;
  }

  const hashedPassword = await hashPassword(password);

  const changeSuccess = await usersRepository.changePassword(
    userId,
    hashedPassword
  );

  if (!changeSuccess) {
    return null;
  }

  return true;
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  emailIsRegistered,
  checkPassword,
  changePassword,
};
