const { errorResponder, errorTypes } = require('../../../core/errors');
const authenticationServices = require('./authentication-service');
const attempts = {};
const Login_Limit = 5;
const Login_Time = 30 * 60 * 1000;

/**
 * Handle login request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function login(request, response, next) {
  const { email, password } = request.body;

  try {
    // Check apakah percobaan login sebelumnya melewati batas waktu lockout
    if (attempts[email] && attempts[email].lastAttempt && Date.now() - attempts[email].lastAttempt > Login_Time) {
      attempts[email] = { count: 0, lastAttempt: null };
    }

    // Check login apakah sudah melebihi batas percobaan
    attempts[email] = attempts[email] || { count: 0, lastAttempt: null };

    if (attempts[email].count >= Login_Limit) {
      throw errorResponder(
        errorTypes.FORBIDDEN,
        'Too many failed login attempts. Please try again 30 minutes later.'
      );
    }

    // Check login credentials
    const loginSuccess = await authenticationServices.checkLoginCredentials(
      email,
      password
    );

    if (!loginSuccess) {
      attempts[email].count++;
      attempts[email].lastAttempt = Date.now();
      throw errorResponder(
        errorTypes.INVALID_CREDENTIALS,
        'Wrong email or password'
      );
    }

    // Reset percobaan login ketika login berhasil
    attempts[email] = { count: 0, lastAttempt: null };

    return response.status(200).json(loginSuccess);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  login,
};
