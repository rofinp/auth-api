class LoginUser {
  constructor(payload) {
    this._verifyLoginPayload(payload);
    const { username, password } = payload;
    this.username = username;
    this.password = password;
  }

  _verifyLoginPayload({ username, password }) {
    if (!username || !password) {
      throw new Error('LOGIN_USER.IS_MISSING_REQUIRED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string') {
      throw new Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }
  }
}

module.exports = LoginUser;
