const express = require('express');
const mongoose = require('mongoose');

const cookieParser = require('cookie-parser');
const { errors } = require('celebrate');
const router = require('./routes');
const ErrorHandler = require('./middlewares/error');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(cookieParser());
app.use(router);
app.use(ErrorHandler);
app.use(errors());

app.use((err, req, res) => {
  res.status(err.statusCode || 500).send({ message: err.message });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
