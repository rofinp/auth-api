const AuthRepositoryPostgres = require('../AuthRepositoryPostgres');
const AuthRepository = require('../../../Domains/authentications/AuthRepository');
const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const pool = require('../../database/postgres/pool');
const InvariantError = require('../../../Commons/exceptions/InvariantError');

describe('AuthRepositoryPostgres', () => {
  it('should be instanceof AuthRepository domain', () => {
    const authRepositoryPostgres = new AuthRepositoryPostgres();
    expect(authRepositoryPostgres).toBeInstanceOf(AuthRepository);
  });

  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('addToken function', () => {
    it('should add token to database', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);
      const token = 'token';

      // Action
      await authRepositoryPostgres.addRefreshToken(token);

      // Assert
      const theToken = await AuthenticationsTableTestHelper.findToken(token);
      expect(theToken).toHaveLength(1);
      expect(theToken[0].token).toBe(token);
    });
  });

  describe('checkRefreshToken function', () => {
    it('should throw InvariantError when the token is not available', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);

      // Action and Assert
      await expect(() => authRepositoryPostgres.checkRefreshToken('token')).rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError when the token is available', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action and Assert
      await expect(authRepositoryPostgres.checkRefreshToken(token))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('deleteToken', () => {
    it('should delete token from the database', async () => {
      // Arrange
      const authRepositoryPostgres = new AuthRepositoryPostgres(pool);
      const token = 'token';
      await AuthenticationsTableTestHelper.addToken(token);

      // Action
      await authRepositoryPostgres.deleteRefreshToken(token);

      // Assert
      const deletedToken = await AuthenticationsTableTestHelper.findToken(token);
      expect(deletedToken).toHaveLength(0);
    });
  });
});
