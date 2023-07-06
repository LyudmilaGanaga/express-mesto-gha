const router = require('express').Router();
const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const {
  validationUpdateAvatar,
  validationUpdateUser,
  validationGetUser,
} = require('../middlewares/validation');

router.get('/', getUsers);
router.get('/me/', getCurrentUser);

router.get('/:userId', getUserById, validationGetUser);

router.patch('/me', updateUser, validationUpdateUser);
router.patch('/me/avatar', updateAvatar, validationUpdateAvatar);

module.exports = router;
