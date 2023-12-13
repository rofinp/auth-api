const AuthenticationError = require('../AuthenticationError');

describe('AuthenticationError', () => {
  it('should create AuthenticationError correctly', () => {
    const authenticationError = new AuthenticationError('error during authentication');

    expect(authenticationError.statusCode).toEqual(401);
    expect(authenticationError.message).toEqual('error during authentication');
    expect(authenticationError.name).toEqual('AuthenticationError');
  });
});
