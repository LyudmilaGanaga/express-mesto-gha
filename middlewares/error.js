/* eslint-disable no-unused-vars */
function ErrorHandler(err, req, res, next) {
  const { statusCode = 500 } = err;
  let { message } = err;

  if (statusCode === 500) {
    message = 'Ошибка';
  }

  res.status(statusCode).send({ message });
}

module.exports = { ErrorHandler };
