const LoginUser = require('../../Domains/users/entities/LoginUser');
const Authentication = require('../../Domains/authentications/entities/Authentication');

class LoginUseCase {
  constructor({
    userRepository, authRepository, passwordHash, tokenManager,
  }) {
    this._userRepository = userRepository;
    this._authRepository = authRepository;
    this._passwordHash = passwordHash;
    this._tokenManager = tokenManager;
  }

  async execute(useCasePayload) {
    const { username, password } = new LoginUser(useCasePayload);
    const getHashedPassword = await this._userRepository.getPassword(username);
    await this._passwordHash.compare(password, getHashedPassword);
    const id = await this._userRepository.getId(username);

    const accessToken = await this._tokenManager.createAccessToken({ username, id });
    const refreshToken = await this._tokenManager.createRefreshToken({ username, id });

    const authentication = new Authentication({ accessToken, refreshToken });
    await this._authRepository.addRefreshToken(authentication.refreshToken);

    return authentication;
  }
}

module.exports = LoginUseCase;
