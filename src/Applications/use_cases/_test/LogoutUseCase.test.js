const LogoutUseCase = require('../LogoutUseCase');
const AuthRepository = require('../../../Domains/authentications/AuthRepository');

describe('LogoutUseCase', () => {
  it('should orchestrates the delete authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    /* creating dependency of use case */
    const mockAuthRepository = new AuthRepository();

    /* mocking needed functions */
    mockAuthRepository.deleteRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthRepository.checkTokenAvailability = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const logoutUseCase = new LogoutUseCase({
      authRepository: mockAuthRepository,
    });

    // Action
    await logoutUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthRepository.checkTokenAvailability)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthRepository.deleteRefreshToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
