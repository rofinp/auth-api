const InvariantError = require('./InvariantError');

const DomainErrorTranslator = {
  translate(error) {
    return DomainErrorTranslator._directories[error.message] || error;
  },
};

DomainErrorTranslator._directories = {
  'REGISTER_USER.IS_MISSING_REQUIRED_PROPERTY':
    new InvariantError('cannot create new user: the required property does not exist'),
  'REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION':
    new InvariantError('cannot create new user: the data type does not meet the specification'),
  'REGISTER_USER.USERNAME_LIMIT_CHAR':
    new InvariantError('cannot create new user: the username exceeds 50 characters'),
  'REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER':
    new InvariantError('cannot create new user: the username contains a prohibited character'),
};

module.exports = DomainErrorTranslator;
