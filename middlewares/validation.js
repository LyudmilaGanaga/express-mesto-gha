const { celebrate, Joi } = require('celebrate');
const { URL_REGEX } = require('../utils/constants');
// валидации пользователя
const validationGetUser = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24),
  }),
});
const validationUpdateUser = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
  }),
});

const validationUpdateAvatar = celebrate({
  body: Joi.object().keys({
    avatar: Joi.string().uri().regex(URL_REGEX),
  }),
});

module.exports = {
  validationUpdateAvatar,
  validationUpdateUser,
  validationGetUser,
};
