const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { celebrate, Joi, errors } = require('celebrate');
const router = require('./routes');
const auth = require('./middlewares/auth');

const app = express();
const { createUser, login } = require('./controllers/users');
const { URL_REGEX } = require('./utils/constants');

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    about: Joi.string().min(2).max(30),
    avatar: Joi.string().regex(URL_REGEX),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(express.json());
app.use(cookieParser());
app.use(auth);
app.use(router);
app.use(errors());

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

// const NotFoundError = require('./errors/NotFoundError');
// const ErrorHandler = require('./middlewares/error');

// app.use((req, res, next) => {
//   const error = new Error('Page not found');
//   res.status(404).send({ message: 'Page not found' });
//   next(error);
// });

app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).send({
    message: statusCode === 500
      ? 'Internal Server Error'
      : message,
  });
  next();
});

// module.exports = ErrorHandler;

// app.use(ErrorHandler);

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
