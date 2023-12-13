class ClientError extends Error {
  constructor(message, statusCode = 400) {
    super(message);

    if (this.constructor.name === 'ClientError') {
      throw new Error('an abstract class cannot be instantiated');
    }

    this.name = 'ClientError';
    this.statusCode = statusCode;
  }
}

module.exports = ClientError;
