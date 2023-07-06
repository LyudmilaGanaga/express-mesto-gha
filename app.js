const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const ErrorHandler = require('./middlewares/error');
const auth = require('./middlewares/auth');
const authRout = require('./routes/auth');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());

app.use(router);
app.use(ErrorHandler);
app.use(auth);
app.use(authRout);
app.use(errors());

app.use((req, res, next) => {
  const error = new Error('Page not found');
  res.status(404).send({ message: 'Page not found' });
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res) => {
  res.status(err.status || 500);
  res.json({
    error: {
      message: err.message,
    },
  });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
