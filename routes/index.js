const router = require('express').Router();
const NotFoundError = require('../errors/NotFoundError');
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const { auth } = require('../middlewares/auth');

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.use((req, res, next) => {
  next(NotFoundError('Страница не найдена'));
});

module.exports = router;
