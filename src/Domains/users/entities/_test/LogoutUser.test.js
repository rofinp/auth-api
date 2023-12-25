const LogoutUser = require('../LogoutUser');

describe('a LogoutUser entity', () => {
  it('should throw an error when the payload does not contains required properties', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new LogoutUser(payload)).toThrow('LOGOUT_USER.IS_MISSING_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      refreshToken: 123,
    };

    // Action & Assert
    expect(() => new LogoutUser(payload)).toThrow('LOGOUT_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create a logoutUser object correctly', () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    // Action
    const { refreshToken } = new LogoutUser(payload);

    // Assert
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
