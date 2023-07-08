const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const {
  getUsers, getUserById, updateUser, updateAvatar, getCurrentUser,
} = require('../controllers/users');

const { URL_REGEX } = require('../utils/constants');

router.get('/', getUsers);

//  возвращает информацию о текущем пользователе.
router.get('/me', getCurrentUser);

router.get('/:userId', celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24),
  }),
}), getUserById);

router.patch('/me', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
}), updateUser);

router.patch('/me/avatar', celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().regex(URL_REGEX),
  }),
}), updateAvatar);

module.exports = router;
