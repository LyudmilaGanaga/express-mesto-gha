const router = require('express').Router();
const { celebrate } = require('celebrate');
const Joi = require('joi');
const { URL_REGEX } = require('../utils/constants');

const userRoutes = require('./users');
const cardRoutes = require('./cards');

const { createUser, login } = require('../controllers/users');
const auth = require('../middlwares/auth');

// авторизация
router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

// регистрация
router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().uri().regex(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use(auth);

router.use('/users', userRoutes);
router.use('/cards', cardRoutes);

module.exports = router;
