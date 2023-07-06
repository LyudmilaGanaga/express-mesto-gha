const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const {
  validationCreateUser,
  validationUpdateAvatar,
  validationUpdateUser,
  validationGetUser,
} = require('../middlewares/validation');

router.get('/', getUsers, validationGetUser);
router.get('/:userId', getUserById);
router.get('/me/', getCurrentUser, validationCreateUser);

// router.post('/', createUser);
router.patch('/me', updateUser, validationUpdateUser);

router.patch('/me/avatar', updateAvatar, validationUpdateAvatar);

module.exports = router;
