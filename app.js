const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const NotFoundError = require('./errors/NotFoundError');
const ErrorHandler = require('./middlewares/error');
const auth = require('./middlewares/auth');
const { createUser, login } = require('./controllers/users');
const { validationLogin, validationCreateUser } = require('./middlewares/validation');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.use(router);

app.use(auth);
app.use(errors());
app.use(ErrorHandler);

app.use((req, res, next) => {
  const error = new Error('Page not found');
  res.status(404).send({ message: 'Page not found' });
  next(error);
});

app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.post('/signin', login, validationLogin);
app.post('/signup', createUser, validationCreateUser);

router.use(() => {
  throw new NotFoundError('Страница не найдена');
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
