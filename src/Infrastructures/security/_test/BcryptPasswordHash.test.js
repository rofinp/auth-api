const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');

describe('BcryptPasswordHash', () => {
  describe('hash function', () => {
    it('should encrypt password correctly', async () => {
      // Arrange
      const spyHash = jest.spyOn(bcrypt, 'hash');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);

      // Action
      const encryptedPassword = await bcryptPasswordHash.hash('plain_password');

      // Assert
      expect(typeof encryptedPassword).toEqual('string');
      expect(spyHash).toHaveBeenCalledWith('plain_password', 10); // 10 is the default value of saltRound for BcryptPasswordHash
      expect(encryptedPassword).not.toEqual('plain_password');
    });
  });

  describe('compare password', () => {
    it('should throw AuthenticationError when password does not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const password = 'plain_password';
      const hashedPassword = 'hashed_password';

      // Action & Assert
      await expect(bcryptPasswordHash.compare(password, hashedPassword))
        .rejects.toThrow(AuthenticationError);
    });

    it('should not throw an AuthenticationError when password match', async () => {
      // Arrange
      const spyCompare = jest.spyOn(bcrypt, 'compare');
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const password = 'plain_password';
      const hashedPassword = await bcryptPasswordHash.hash(password);

      // Action & Assert
      await expect(bcryptPasswordHash.compare(password, hashedPassword))
        .resolves.not.toThrow(AuthenticationError);
      expect(spyCompare).toHaveBeenCalledWith(password, hashedPassword);
    });
  });
});
