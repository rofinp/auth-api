const Authentication = require('../Authentication');

describe('an Authentication entity', () => {
  it('should throw an error when payload did not contain needed properties', () => {
    // Arrange
    const payload = {
      accessToken: 'valid_access_token',
    };

    // Action & Assert
    expect(() => new Authentication(payload)).toThrow('AUTHENTICATION.MISSING_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      accessToken: [123],
      refreshToken: {},
    };

    // Action & Assert
    expect(() => new Authentication(payload)).toThrow('AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create Authentication object correctly', () => {
    // Arrange
    const payload = {
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    };

    // Action
    const { accessToken, refreshToken } = new Authentication(payload);

    // Assert
    expect(accessToken).toEqual(payload.accessToken);
    expect(refreshToken).toEqual(payload.refreshToken);
  });
});
