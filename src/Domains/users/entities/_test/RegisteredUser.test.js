const RegisteredUser = require('../RegisteredUser');

describe('a RegisteredUser entity', () => {
  it('should throw an error when the payload does not contains the required properties', () => {
    // Arrange
    const payload = {
      username: 'alditaher',
      fullname: 'Aldi Taher',
    };

    // Action & Assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_CONTAIN_NEEDED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      id: 123,
      username: 'alditaher',
      fullname: {},
    };

    // Action & Assert
    expect(() => new RegisteredUser(payload)).toThrow('REGISTERED_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create registeredUser object correctly', () => {
    // Arrange
    const payload = {
      id: 'user-123',
      username: 'alditaher',
      fullname: 'Aldi Taher',
    };

    // Action
    const registeredUser = new RegisteredUser(payload);

    // Assert
    expect(registeredUser.id).toEqual(payload.id);
    expect(registeredUser.username).toEqual(payload.username);
    expect(registeredUser.fullname).toEqual(payload.fullname);
  });
});
