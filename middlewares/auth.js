const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    throw new UnauthorizedError('Authorization token not found');
  }

  try {
    const payload = jwt.verify(token, 'some-secret-key');
    req.user = payload;
    next();
  } catch (err) {
    throw new UnauthorizedError('Invalid authorization token');
  }
};

module.exports = auth;
