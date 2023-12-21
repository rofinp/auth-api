class RefreshTokenUseCase {
  constructor({ authRepository, tokenManager }) {
    this._authRepository = authRepository;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const { refreshToken } = useCasePayload;
    const { id } = await this._tokenManager.verifyRefreshToken(refreshToken);
    await this._authRepository.checkTokenAvailability(refreshToken);
    const accessToken = await this._tokenManager.generateAccessToken({ id });
    return accessToken;
  }
}

module.exports = RefreshTokenUseCase;
