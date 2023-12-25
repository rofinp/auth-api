const Authentication = require('../Authentication');

describe('an Authentication entity', () => {
  it('should throw an error when the payload did not contains required properties', () => {
    // Arrange
    const payload = {
      accessToken: 'valid_access_token',
    };

    // Action & Assert
    expect(() => new Authentication(payload)).toThrow('AUTHENTICATION.IS_MISSING_REQUIRED_PROPERTY');
  });

  it('should throw an error when the payload does not meet the data type specification', () => {
    // Arrange
    const payload = {
      accessToken: 'access_token',
      refreshToken: {},
    };

    // Action & Assert
    expect(() => new Authentication(payload)).toThrow('AUTHENTICATION.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });

  it('should create an Authentication object correctly', () => {
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
