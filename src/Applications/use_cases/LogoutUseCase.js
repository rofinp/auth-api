class LogoutUseCase {
  constructor({ authRepository }) {
    this._authRepository = authRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = useCasePayload;
    await this._authRepository.checkTokenAvailability(refreshToken);
    await this._authRepository.deleteRefreshToken(refreshToken);
  }
}

module.exports = LogoutUseCase;
