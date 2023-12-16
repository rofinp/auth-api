const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error messages correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.IS_MISSING_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('cannot create new user: the required property does not exist'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('cannot create new user: the data type does not meet the specification'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('cannot create new user: the username exceeds 50 characters'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('cannot create new user: the username contains a prohibited character'));
  });

  it('should expose the original error when the message does not require translation', () => {
    // Arrange
    const error = new Error('some_error_message');

    // Action
    const translatedError = DomainErrorTranslator.translate(error);

    // Assert
    expect(translatedError).toStrictEqual(error);
  });
});
