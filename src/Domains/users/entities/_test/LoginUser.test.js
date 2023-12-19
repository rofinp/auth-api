const LoginUser = require('../LoginUser');

describe('a LoginUser entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      username: 'alditaher',
    };

    // Action & Assert
    expect(() => new LoginUser(payload)).toThrow('LOGIN_USER.IS_MISSING_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      username: {},
      password: true,
    };

    // Action & Assert
    expect(() => new LoginUser(payload)).toThrow('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create login user object correctly', () => {
    // Arrange
    const payload = {
      username: 'alditaher',
      password: 'alditaher007',
    };

    // Action
    const { username, password } = new LoginUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
  });
});
