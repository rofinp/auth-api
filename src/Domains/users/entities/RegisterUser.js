class RegisterUser {
  constructor(payload) {
    this._verifyRegisterPayload(payload);

    const { username, password, fullname } = payload;

    this.username = username;
    this.password = password;
    this.fullname = fullname;
  }

  _verifyRegisterPayload({ username, password, fullname }) {
    if (!username || !password || !fullname) {
      throw new Error('REGISTER_USER.IS_MISSING_REQUIRED_PROPERTY');
    }

    if (typeof username !== 'string' || typeof password !== 'string' || typeof fullname !== 'string') {
      throw new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION');
    }

    if (username.length > 50) {
      throw new Error('REGISTER_USER.USERNAME_LIMIT_CHAR');
    }

    if (!username.match(/^[\w]+$/)) {
      throw new Error('REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER');
    }
  }
}

module.exports = RegisterUser;
