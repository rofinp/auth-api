const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const TokenManager = require('../../../Applications/security/TokenManager');

describe('Jwt Token', () => {
  it('should be instance of TokenManager', () => {
    expect(new JwtTokenManager()).toBeInstanceOf(TokenManager);
  });
  describe('Generate Access Token function', () => {
    it('should generate access token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const spyGenerateAccessToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const generatedAccessToken = await jwtTokenManager.generateAccessToken(payload);

      // Assert
      expect(typeof generatedAccessToken).toEqual('string');
      expect(generatedAccessToken).not.toEqual(payload);
      expect(spyGenerateAccessToken).toHaveBeenCalledWith(payload, process.env.ACCESS_TOKEN_KEY);
    });
  });

  describe('Generate Refresh Token', () => {
    it('should generate refresh token correctly', async () => {
      // Arrange
      const payload = {
        id: 'user-123',
      };
      const spyGenerateRefreshToken = jest.spyOn(Jwt.token, 'generate');
      const jwtTokenManager = new JwtTokenManager(Jwt.token);

      // Action
      const generatedRefreshToken = await jwtTokenManager.generateRefreshToken(payload);

      // Assert
      expect(typeof generatedRefreshToken).toEqual('string');
      expect(generatedRefreshToken).not.toEqual(payload);
      expect(spyGenerateRefreshToken)
        .toHaveBeenCalledWith(payload, process.env.REFRESH_TOKEN_KEY);
    });
  });

  describe('verifyRefreshToken', () => {
    it('should throw InvariantError when verification failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const AccesssToken = jwtTokenManager.generateAccessToken({ id: 'user-123' });

      // Action & Assert
      await expect(() => jwtTokenManager.verifyRefreshToken(AccesssToken))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw InvariantError if verification refresh token success', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.generateRefreshToken({ id: 'user-123' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves.not.toThrow(InvariantError);
    });
  });
});
