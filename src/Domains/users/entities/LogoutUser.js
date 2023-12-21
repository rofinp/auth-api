class LogoutUser {
  constructor(payload) {
    this._verifyLogoutPayload(payload);
    const { refreshToken } = payload;
    this.refreshToken = refreshToken;
  }

  _verifyLogoutPayload({ refreshToken }) {
    if (!refreshToken) {
      throw new Error('LOGOUT_USER.IS_MISSING_REQUIRED_PROPERTY');
    }

    if (typeof refreshToken !== 'string') {
      throw new Error('LOGOUT_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LogoutUser;
