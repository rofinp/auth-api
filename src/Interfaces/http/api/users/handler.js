const AddUserUseCase = require('../../../../Applications/use_cases/AddUserUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');
const ClientError = require('../../../../Commons/exceptions/ClientError');

class UsersHandler {
  constructor(container) {
    this._container = container;
  }

  async postUserHandler(req, res) {
    try {
      const addUserUseCase = this._container.getInstance(AddUserUseCase.name);
      const addedUser = await addUserUseCase.execute(req.payload);
      const response = res.response({
        status: 'success',
        data: {
          addedUser,
        },
      });
      response.code(201);
      return response;
    } catch (error) {
      // if error occured
      const translatedError = DomainErrorTranslator.translate(error);
      if (translatedError instanceof ClientError) {
        const response = res.response({
          status: 'fail',
          message: translatedError.message,
        });
        response.code(translatedError.statusCode);
        return response;
      }

      const response = res.response({
        status: 'error',
        message: 'a failure occurred on our servers',
      });
      response.code(500);
      return response;
    }
  }
}

module.exports = UsersHandler;
