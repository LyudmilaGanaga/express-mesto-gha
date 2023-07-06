class UnauthorizedCardDeleteException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedCardDeleteException';
    this.statusCode = 403;
    this.message = message;
  }
}

module.exports = UnauthorizedCardDeleteException;
