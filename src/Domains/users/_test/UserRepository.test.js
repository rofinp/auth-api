const UserRepository = require('../UserRepository');

describe('UserRepository interface', () => {
  it('should throw an error when invoked the abstract interface', async () => {
    // Arrange
    const userRepository = new UserRepository();

    // Action & Assert
    await expect(userRepository.addUser({})).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.verifyUsernameAvailability('')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getPassword('')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(userRepository.getId('')).rejects.toThrow('USER_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
