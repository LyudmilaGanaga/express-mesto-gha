const express = require('express');
const mongoose = require('mongoose');
const router = require('./routes');

const app = express();

mongoose.connect('mongodb://127.0.0.1:27017/mestodb', {
  useNewUrlParser: true,
});

app.use(express.json());

app.use((req, res, next) => {
  req.user = {
    _id: '649222dfb263f0dcec204273',
  };

  next();
});

app.use(router);

app.use((req, res, next) => {
  const error = new Error('Page not found');
  res.status(404).send({ message: 'Page not found' });
  next(error);
});

// eslint-disable-next-line no-unused-vars
app.use((error, req, res) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message,
    },
  });
});

app.listen(3000, () => {
  // eslint-disable-next-line no-console
  console.log('Слушаю порт 3000');
});
