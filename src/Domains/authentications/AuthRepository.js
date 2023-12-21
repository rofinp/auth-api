class AuthRepository {
  async addRefreshToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async checkRefreshToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }

  async deleteRefreshToken(token) {
    throw new Error('AUTH_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  }
}

module.exports = AuthRepository;
