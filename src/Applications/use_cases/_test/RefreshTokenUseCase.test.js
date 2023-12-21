const RefreshTokenUseCase = require('../RefreshTokenUseCase');
const AuthRepository = require('../../../Domains/authentications/AuthRepository');
const TokenManager = require('../../security/TokenManager');

describe('RefreshTokenUseCase', () => {
  it('should throw error if use case payload not contain refresh token', async () => {
    // Arrange
    const useCasePayload = {};

    // Action
    const refreshTokenUseCase = new RefreshTokenUseCase({});

    // Assert
    await expect(() => refreshTokenUseCase.execute(useCasePayload)).rejects.toThrow('REFRESH_TOKEN.IS_MISSING_REQUIRED_PROPERTY');
  });

  it('should throw error if use case payload not meet data type specification', async () => {
    const useCasePayload = {
      refreshToken: 123,
    };

    const refreshTokenUseCase = new RefreshTokenUseCase({});

    // Assert
    await expect(() => refreshTokenUseCase.execute(useCasePayload)).rejects.toThrow('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
  });
  it('should orchestrates the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    /* creating dependency of use case */
    const mockAuthRepository = new AuthRepository();
    const mockTokenManager = new TokenManager();

    /* mocking needed functions */
    mockAuthRepository.checkRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTokenManager.verifyRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve({ id: 'user-123' }));
    mockTokenManager.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve('new_access_token'));

    /* creating use case instance */
    const refreshTokenUseCase = new RefreshTokenUseCase({
      authRepository: mockAuthRepository,
      tokenManager: mockTokenManager,
    });

    // Action
    const refreshToken = await refreshTokenUseCase.execute(useCasePayload);

    // Assert
    expect(refreshToken).toEqual('new_access_token');

    expect(mockAuthRepository.checkRefreshToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.verifyRefreshToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.generateAccessToken)
      .toHaveBeenCalledWith({ id: 'user-123' });
  });
});
