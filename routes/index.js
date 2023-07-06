const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');
const NotFoundError = require('../errors/NotFoundError');

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);
router.use('*', (req, res, next) => next(new NotFoundError('Не найдено')));

module.exports = router;
