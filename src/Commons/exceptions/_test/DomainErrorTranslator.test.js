const DomainErrorTranslator = require('../DomainErrorTranslator');
const InvariantError = require('../InvariantError');

describe('DomainErrorTranslator', () => {
  it('should translate error messages correctly', () => {
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.IS_MISSING_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_LIMIT_CHAR')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena karakter username melebihi batas limit'));
    expect(DomainErrorTranslator.translate(new Error('REGISTER_USER.USERNAME_CONTAINS_RESTRICTED_CHARACTER')))
      .toStrictEqual(new InvariantError('tidak dapat membuat user baru karena username mengandung karakter terlarang'));
    expect(DomainErrorTranslator.translate(new Error('LOGIN_USER.IS_MISSING_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('tidak dapat melakukan login karena properti yang dibutuhkan tidak ada'));
    expect(DomainErrorTranslator.translate(new Error('LOGIN_USER.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('tidak dapat melakukan login karena tipe data tidak sesuai'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_TOKEN.IS_MISSING_REQUIRED_PROPERTY')))
      .toStrictEqual(new InvariantError('refresh token tidak ditemukan pada payload'));
    expect(DomainErrorTranslator.translate(new Error('REFRESH_TOKEN.NOT_MEET_DATA_TYPE_SPECIFICATION')))
      .toStrictEqual(new InvariantError('refresh token harus string'));
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
