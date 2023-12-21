class RefreshToken {
  constructor(payload) {
    this._verifyRefreshTokenPayload(payload);
    const { refreshToken } = payload;
    this.refreshToken = refreshToken;
  }

  _verifyRefreshTokenPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('REFRESH_TOKEN.IS_MISSING_REQUIRED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = RefreshToken;
