const RefreshToken = require('../../Domains/users/entities/RefreshToken');

class RefreshTokenUseCase {
  constructor({ authRepository, tokenManager }) {
    this._authRepository = authRepository;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new RefreshToken(useCasePayload);
    await this._tokenManager.verifyRefreshToken(refreshToken);
    await this._authRepository.checkRefreshToken(refreshToken);
    const { username, id } = await this._tokenManager.decodePayload(refreshToken);
    const accessToken = await this._tokenManager.generateAccessToken({ username, id });
    return accessToken;
  }
}

module.exports = RefreshTokenUseCase;
