const RefreshToken = require('../RefreshToken');

describe('a RefreshToken entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {};

    // Action & Assert
    expect(() => new RefreshToken(payload)).toThrow('REFRESH_TOKEN.IS_MISSING_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      refreshToken: [],
    };

    // Action & Assert
    expect(() => new RefreshToken(payload)).toThrow('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create refresh token object correctly', () => {
    // Arrange
    const payload = {
      refreshToken: 'refresh_token',
    };

    // Action
    const { refreshToken } = new RefreshToken(payload);

    // Assert
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
