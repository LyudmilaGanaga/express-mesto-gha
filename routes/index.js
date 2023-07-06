const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('./auth');

router.use('/users', userRoutes, auth);
router.use('/cards', cardRoutes, auth);

router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
