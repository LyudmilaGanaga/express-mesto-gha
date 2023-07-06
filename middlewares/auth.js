const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const auth = (req, res, next) => {
  const token = req.cookies.jwt;

  if (!token) {
    return next(new UnauthorizedError('Authentication'));
  }

  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    next(err);
  }

  req.user = payload;
  next();
};

module.exports = auth;
