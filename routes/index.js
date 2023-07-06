const router = require('express').Router();

const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { createUser, login } = require('../controllers/users');

const { validationLogin, validationCreateUser } = require('../middlewares/validation');

const NotFoundError = require('../errors/NotFoundError');

const auth = require('../middlewares/auth');

router.use(auth);

router.post('/signup', createUser, validationCreateUser);
router.post('/signin', login, validationLogin);

router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
