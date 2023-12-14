const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const RegisterUser = require('../../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../../Domains/users/entities/RegisteredUser');
const pool = require('../../database/postgres/pool');
const UserRepositoryPostgres = require('../UserRepositoryPostgres');

describe('UserRepositoryPostgres', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  describe('verifyUsernameAvailability function', () => {
    it('should throw an InvariantError when username is not available', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'alditaher' }); // input new user with username: alditaher
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUsernameAvailability('alditaher')).rejects.toThrow(InvariantError);
    });

    it('should not throw an InvariantError when username is available', async () => {
      // Arrange
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, {});

      // Action & Assert
      await expect(userRepositoryPostgres.verifyUsernameAvailability('alditaher')).resolves.not.toThrow(InvariantError);
    });
  });

  describe('addUser function', () => {
    it('should add a user to the pool', async () => {
      // Arrange
      const registerUser = {
        username: 'alditaher',
        password: 'alditaher007',
        fullname: 'Aldi Taher',
      };

      const fakeIDGenerator = () => '123'; // stub!
      const userRepositoryPostgres = new UserRepositoryPostgres(pool, fakeIDGenerator);

      // Action
      await userRepositoryPostgres.addUser(registerUser);

      // Assert
      const users = await UsersTableTestHelper.findUserById('user-123');
      expect(users).toHaveLength(1);
    });

    it('should return registered user correctly', async () => {
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
      expect(registeredUser).toStrictEqual(new RegisteredUser({
        id: 'user-123',
        username: 'alditaher',
        fullname: 'Aldi Taher',
      }));
    });
  });
});
