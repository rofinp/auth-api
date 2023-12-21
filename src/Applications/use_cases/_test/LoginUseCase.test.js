const Authentication = require('../../../Domains/authentications/entities/Authentication');
const AuthRepository = require('../../../Domains/authentications/AuthRepository');
const UserRepository = require('../../../Domains/users/UserRepository');
const PasswordHash = require('../../security/PasswordHash');
const TokenManager = require('../../security/TokenManager');
const LoginUseCase = require('../LoginUseCase');

describe('LoginUseCase', () => {
  it('should orchestrates the authentication action correctly', async () => {
    // Arrange
    const useCasePayload = {
      username: 'alditaher',
      password: 'alditaher007',
    };

    const expectedTokens = new Authentication({
      accessToken: 'access_token',
      refreshToken: 'refresh_token',
    });

    /* creating dependency of use case */
    const mockUserRepository = new UserRepository();
    const mockAuthRepository = new AuthRepository();
    const mockPasswordHash = new PasswordHash();
    const mockTokenManager = new TokenManager();

    /* mocking needed functions */
    mockUserRepository.getPassword = jest.fn()
      .mockImplementation(() => Promise.resolve('encrypted_password'));
    mockUserRepository.getId = jest.fn()
      .mockImplementation(() => Promise.resolve('user-123'));
    mockPasswordHash.compare = jest.fn()
      .mockImplementation(() => Promise.resolve());
    mockTokenManager.generateAccessToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedTokens.accessToken));
    mockTokenManager.generateRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve(expectedTokens.refreshToken));
    mockAuthRepository.addRefreshToken = jest.fn()
      .mockImplementation(() => Promise.resolve());

    /* creating use case instance */
    const loginUseCase = new LoginUseCase({
      userRepository: mockUserRepository,
      passwordHash: mockPasswordHash,
      tokenManager: mockTokenManager,
      authRepository: mockAuthRepository,
    });

    // Action
    const authenticated = await loginUseCase.execute(useCasePayload);

    // Assert
    expect(authenticated).toEqual(expectedTokens);
    expect(mockUserRepository.getPassword).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockUserRepository.getId).toHaveBeenCalledWith(useCasePayload.username);
    expect(mockPasswordHash.compare).toHaveBeenCalledWith(useCasePayload.password, 'encrypted_password');
    expect(mockTokenManager.generateAccessToken).toHaveBeenCalledWith({ username: useCasePayload.username, id: 'user-123' });
    expect(mockTokenManager.generateRefreshToken).toHaveBeenCalledWith({ username: useCasePayload.username, id: 'user-123' });
    expect(mockAuthRepository.addRefreshToken).toHaveBeenCalledWith(expectedTokens.refreshToken);
  });
});
