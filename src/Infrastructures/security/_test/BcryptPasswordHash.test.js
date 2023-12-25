const bcrypt = require('bcrypt');
const BcryptPasswordHash = require('../BcryptPasswordHash');
const AuthenticationError = require('../../../Commons/exceptions/AuthenticationError');
const PasswordHash = require('../../../Applications/security/PasswordHash');

describe('BcryptPasswordHash', () => {
  it('should be instance of PasswordHash', () => {
    const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
    expect(bcryptPasswordHash).toBeInstanceOf(PasswordHash);
  });

  describe('test hash function', () => {
    it('should encrypt the password correctly', async () => {
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

  describe('test compare password function', () => {
    it('should throw an AuthenticationError when the password does not match', async () => {
      // Arrange
      const bcryptPasswordHash = new BcryptPasswordHash(bcrypt);
      const password = 'plain_password';
      const hashedPassword = 'hashed_password';

      // Action & Assert
      await expect(bcryptPasswordHash.compare(password, hashedPassword))
        .rejects.toThrow(AuthenticationError);
    });

    it('should not throw an AuthenticationError when the password match', async () => {
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
