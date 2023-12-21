const InvariantError = require('../../Commons/exceptions/InvariantError');
const AuthRepository = require('../../Domains/authentications/AuthRepository');

class AuthRepositoryPostgres extends AuthRepository {
  constructor(pool) {
    super();
    this._pool = pool;
  }

  async addRefreshToken(token) {
    const addTokenQuery = {
      text: 'INSERT INTO authentications (token) VALUES ($1)',
      values: [token],
    };

    await this._pool.query(addTokenQuery);
  }

  async checkRefreshToken(token) {
    const verifyTokenQuery = {
      text: 'SELECT token FROM authentications WHERE token = $1',
      values: [token],
    };

    const result = await this._pool.query(verifyTokenQuery);
    if (!result.rowCount) {
      throw new InvariantError('refresh token tidak ditemukan di database');
    }
  }

  async deleteRefreshToken(token) {
    const deleteTokenQuery = {
      text: 'DELETE FROM authentications WHERE token = $1',
      values: [token],
    };

    await this._pool.query(deleteTokenQuery);
  }
}

module.exports = AuthRepositoryPostgres;
