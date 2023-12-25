const Jwt = require('@hapi/jwt');
const JwtTokenManager = require('../JwtTokenManager');
const InvariantError = require('../../../Commons/exceptions/InvariantError');
const TokenManager = require('../../../Applications/security/TokenManager');

describe('Jwt Token', () => {
  it('should be instance of TokenManager', () => {
    const jwtTokenManager = new JwtTokenManager(Jwt.token);
    expect(jwtTokenManager).toBeInstanceOf(TokenManager);
  });

  describe('Test Generate Access Token Function', () => {
    it('should generate access token correctly', async () => {
      // Arrange
      const payload = {
        username: 'alditaher',
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

  describe('Test Generate Refresh Token Function', () => {
    it('should generate refresh token correctly', async () => {
      // Arrange
      const payload = {
        username: 'alditaher',
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

  describe('Test Verify Refresh Token Function', () => {
    it('should throw an InvariantError when verification access token failed', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = jwtTokenManager.generateAccessToken({ username: 'alditaher', id: 'user-123' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(accessToken))
        .rejects.toThrow(InvariantError);
    });

    it('should not throw an InvariantError when verification refresh token success', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const refreshToken = await jwtTokenManager.generateRefreshToken({ username: 'alditaher', id: 'user-123' });

      // Action & Assert
      await expect(jwtTokenManager.verifyRefreshToken(refreshToken))
        .resolves.not.toThrow(InvariantError);
    });
  });

  describe('Test Decode Payload Function', () => {
    it('should decode payload correctly', async () => {
      // Arrange
      const jwtTokenManager = new JwtTokenManager(Jwt.token);
      const accessToken = await jwtTokenManager
        .generateAccessToken({ username: 'alditaher', id: 'user-123' });

      // Action
      const { username: expectedUsername, id: expectedId } = await jwtTokenManager
        .decodePayload(accessToken);

      // Assert
      expect(expectedUsername).toEqual('alditaher');
      expect(expectedId).toEqual('user-123');
    });
  });
});
