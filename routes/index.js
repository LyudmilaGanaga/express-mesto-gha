const express = require('express');
const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const userRoutes = require('./users');
const cardRoutes = require('./cards');

const NotFoundError = require('../errors/NotFoundError');

const { createUser, login } = require('../controllers/users');
const auth = require('../middlewares/auth');
const { URL_REGEX } = require('../utils/constants');

router.all('*', express.json());

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

router.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

router.use('/users', auth, userRoutes);
router.use('/cards', auth, cardRoutes);

router.all('*', (req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

module.exports = router;
