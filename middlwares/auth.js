const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

// const auth = (req, res, next) => {
//   const token = req.cookies.jwt;
//   let payload;

//   try {
//     payload = jwt.verify(token, 'SECRET');
//   } catch (err) {
//     next(err);
//   }

//   req.user = payload;
//   next();
// };

// module.exports = auth;

// // eslint-disable-next-line consistent-return
const auth = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith('Bearer ')) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  const token = authorization.replace('Bearer ', '');
  let payload;

  try {
    payload = jwt.verify(token, 'SECRET');
  } catch (err) {
    throw new UnauthorizedError('Необходима авторизация');
  }

  req.user = payload;
  next();
};

module.exports = auth;
