const router = require('express').Router();
const userRoutes = require('./users');
const cardRoutes = require('./cards');
const auth = require('../middlewares/auth');

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
