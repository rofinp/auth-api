const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const UserRepository = require('../../../Domains/users/UserRepository');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  it('should be instance of UserRepository domain', () => {
    const userRepositoryPostgres = new UserRepositoryPostgres();
    expect(userRepositoryPostgres).toBeInstanceOf(UserRepository);
  });

  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('test verifyUsernameAvailability function', () => {
    it('should throw an InvariantError when username is not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'alditaher' }); // input new user with username: alditaher
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(() => userRepositoryPostgres.verifyUsernameAvailability('alditaher')).rejects.toThrow(InvariantError);
    });

    it('should not throw an InvariantError when username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUsernameAvailability('alditaher')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('test addUser function', () => {
    it('should return registered user object correctly', async () => {
      // Arrange
      const registerUser = new RegisterUser({
        username: 'alditaher',
        password: 'alditaher007',
        fullname: 'Aldi Taher',
      });

      const fakeIDGenerator = () => '123';
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIDGenerator);

      // Action
      const registeredUser = await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const userId = await UsersTableTestHelper.findUserById('user-123');
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'alditaher',
        fullname: 'Aldi Taher',
      }));
      expect(userId).toHaveLength(1);
    });
  });

  describe('test getPassword function', () => {
    it('should throw an InvariantError when the username does not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      expect(() => userRepositoryPostgres.getPassword('alditaher'))
        .rejects.toThrow(InvariantError);
    });

    it('should return the password when the username is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        username: 'alditaher',
        password: 'alditaher007',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const password = await userRepositoryPostgres.getPassword('alditaher');

      // Assert
      expect(password).toEqual('alditaher007');
    });
  });

  describe('test getId function', () => {
    it('should throw an InvariantError when the username does not exist', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      expect(() => userRepositoryPostgres.getId('alditaher'))
        .rejects.toThrow(InvariantError);
    });

    it('should return the id when the username is found', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({
        id: 'user-123',
        username: 'alditaher',
      });

      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action
      const id = await userRepositoryPostgres.getId('alditaher');

      // Assert
      expect(id).toEqual('user-123');
    });
  });
});
