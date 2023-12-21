const LoginUseCase = require('../../../../Applications/use_cases/LoginUseCase');
const LogoutUseCase = require('../../../../Applications/use_cases/LogoutUseCase');
const RefreshTokenUseCase = require('../../../../Applications/use_cases/RefreshTokenUseCase');

class AuthenticationsHandler {
  constructor(container) {
    this._container = container;
  }

  async postAuthenticationHandler(req, res) {
    const loginUseCase = this._container.getInstance(LoginUseCase.name);
    const { accessToken, refreshToken } = await loginUseCase.execute(req.paylaod);
    const response = res.response({
      status: 'success',
      message: 'authentications successfully generated',
      data: { accessToken, refreshToken },
    });
    response.code(201);
    return response;
  }

  async putAuthenticationHandler(req) {
    const refreshTokenUseCase = this._container.getInstance(RefreshTokenUseCase.name);
    const accessToken = await refreshTokenUseCase.execute(req.payload);
    return {
      status: 'success',
      message: 'access token successfully updated',
      data: { accessToken },
    };
  }

  async deleteAuthenticationHandler(req) {
    const logoutUseCase = this._container.getInstance(LogoutUseCase.name);
    await logoutUseCase.execute(req.payload);
    return {
      status: 'success',
      message: 'refresh token successfully deleted',
    };
  }
}

module.exports = AuthenticationsHandler;
