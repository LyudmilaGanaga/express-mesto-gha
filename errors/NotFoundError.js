class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.name = 'Пользователь не найден';
    this.statusCode = 404;
  }
}

module.exports = NotFoundError;
