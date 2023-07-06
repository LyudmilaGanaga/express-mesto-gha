class UnauthorizedCardDeleteException extends Error {
  constructor(message) {
    super(message);
    this.name = 'UnauthorizedCardDeleteException';
    this.statusCode = 403;
  }
}

module.exports = UnauthorizedCardDeleteException;
