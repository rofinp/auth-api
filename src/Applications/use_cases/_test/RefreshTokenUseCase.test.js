const RefreshTokenUseCase = require('../RefreshTokenUseCase');
const AuthRepository = require('../../../Domains/authentications/AuthRepository');
const TokenManager = require('../../security/TokenManager');

describe('RefreshTokenUseCase', () => {
  it('should orchestrates the refresh authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    /* creating dependency of use case */
    const mockAuthRepository = new AuthRepository();
    const mockTokenManager = new TokenManager();

    /* mocking needed functions */
    mockAuthRepository.checkTokenAvailability = jest.fn()
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

    expect(mockAuthRepository.checkTokenAvailability)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.verifyRefreshToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockTokenManager.generateAccessToken)
      .toHaveBeenCalledWith({ id: 'user-123' });
  });
});
