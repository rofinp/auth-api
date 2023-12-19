const PasswordHash = require('../PasswordHash');

describe('PasswordHash interface', () => {
  it('should throw an error when invoked the abstract interface', async () => {
    // Arrange
    const passwordHash = new PasswordHash();

    // Action & Assert
    await expect(passwordHash.hash('dummy_password')).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
    await expect(passwordHash.compare({})).rejects.toThrow('PASSWORD_HASH.METHOD_NOT_IMPLEMENTED');
  });
});
