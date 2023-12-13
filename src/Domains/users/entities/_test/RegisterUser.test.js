const RegisterUser = require('../RegisterUser');

describe('a RegisterUser entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      username: 'abc',
      password: 'abc',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      username: 123,
      password: 'haha',
      fullname: true,
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should throw an error when username contains more than 50 characters', () => {
    // Arrange
    const payload = {
      username: 'alditaheralditaheralditaheralditaheralditaheralditaher',
      password: 'alditaher007',
      fullname: 'Aldi Taher',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_LIMIT_CHAR');
  });

  it('should throw an error when username contains restricted characters', () => {
    // Arrange
    const payload = {
      username: 'aldi taher',
      password: 'alditaher007',
      fullname: 'Aldi Taher',
    };

    // Action & Assert
    expect(() => new RegisterUser(payload)).toThrow('REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER');
  });

  it('should create registerUser object correctly', () => {
    // Arrange
    const payload = {
      username: 'alditaher',
      password: 'alditaher007',
      fullname: 'Aldi Taher',
    };

    // Action
    const { username, password, fullname } = new RegisterUser(payload);

    // Assert
    expect(username).toEqual(payload.username);
    expect(password).toEqual(payload.password);
    expect(fullname).toEqual(payload.fullname);
  });
});
