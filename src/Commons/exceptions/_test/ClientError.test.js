const ClientError = require('../ClientError');

describe('ClientError', () => {
  it('should throw an error when directly used', () => {
    expect(() => new ClientError('')).toThrow('an abstract class cannot be instantiated');
  });
});
