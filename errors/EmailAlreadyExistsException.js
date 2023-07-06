class EmailAlreadyExistsException extends Error {
  constructor(message) {
    super(message);
    this.name = 'EmailAlreadyExistsException';
    this.statusCode = 409;
  }
}

module.exports = EmailAlreadyExistsException;
