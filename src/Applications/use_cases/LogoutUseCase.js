const LogoutUser = require('../../Domains/users/entities/LogoutUser');

class LogoutUseCase {
  constructor({ authRepository }) {
    this._authRepository = authRepository;
  }

  async execute(useCasePayload) {
    const { refreshToken } = new LogoutUser(useCasePayload);
    await this._authRepository.checkRefreshToken(refreshToken);
    await this._authRepository.deleteRefreshToken(refreshToken);
  }
}

module.exports = LogoutUseCase;
