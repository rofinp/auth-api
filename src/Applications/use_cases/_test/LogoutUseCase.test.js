const LogoutUseCase = require('../LogoutUseCase');
const AuthRepository = require('../../../Domains/authentications/AuthRepository');

describe('LogoutUseCase', () => {
  it('should orchestrates the delete action correctly', async () => {
    // Arrange
    const useCasePayload = {
      refreshToken: 'refresh_token',
    };

    /* creating dependency of use case */
    const mockAuthRepository = new AuthRepository();

    /* mocking needed functions */
    mockAuthRepository.checkRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockAuthRepository.deleteRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const logoutUseCase = new LogoutUseCase({
      authRepository: mockAuthRepository,
    });

    // Action
    await logoutUseCase.execute(useCasePayload);

    // Assert
    expect(mockAuthRepository.checkRefreshToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
    expect(mockAuthRepository.deleteRefreshToken)
      .toHaveBeenCalledWith(useCasePayload.refreshToken);
  });
});
