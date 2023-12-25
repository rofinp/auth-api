const TokenManager = require('../TokenManager');

describe('TokenManager', () => {
  it('should throw an error when invoked the abstract interface', async () => {
    // Arrange
    const tokenManager = new TokenManager();

    // Action & Assert
    await expect(() => tokenManager.generateAccessToken('access_token')).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(() => tokenManager.generateRefreshToken('refresh_token')).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(() => tokenManager.verifyRefreshToken('refresh_token')).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
    await expect(() => tokenManager.decodePayload('refresh_token')).rejects.toThrow('TOKEN_MANAGER.METHOD_NOT_IMPLEMENTED');
  });
});
