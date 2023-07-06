const router = require('express').Router();
const { createUser, login } = require('../controllers/users');
const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const {
  validationLogin,
  validationCreateUser,
  validationUpdateAvatar,
  validationUpdateUser,
  validationGetUser,
} = require('../middlewares/validation');

router.post('/signup', createUser);
router.post('/signin', login, validationLogin);

router.get('/', getUsers, validationGetUser);
router.get('/:userId', getUserById);

// возвращается информацию о текущем пользователе
router.get('/me/', getCurrentUser, validationCreateUser);

// router.post('/', createUser);
router.patch('/me', updateUser, validationUpdateUser);

router.patch('/me/avatar', updateAvatar, validationUpdateAvatar);

module.exports = router;
