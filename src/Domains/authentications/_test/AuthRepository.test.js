const AuthRepository = require('../AuthRepository');

describe('AuthRepository interface', () => {
  it('should throw an error when invoked the abstract interface', async () => {
    // Arrange
    const authRepository = new AuthRepository();

    // Action & Assert
    expect(authRepository.addRefreshToken('')).rejects.toThrow('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(authRepository.verifyRefreshToken('')).rejects.toThrow('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    expect(authRepository.deleteRefreshToken('')).rejects.toThrow('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
