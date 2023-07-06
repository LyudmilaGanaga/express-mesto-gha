const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

module.exports = router;
