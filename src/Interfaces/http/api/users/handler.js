const AddUserUseCase = require('../../../../Applications/use_cases/AddUserUseCase');
const DomainErrorTranslator = require('../../../../Commons/exceptions/DomainErrorTranslator');

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
      const response = res.response({
        status: 'fail',
        message: translatedError.message,
      });
      response.code(translatedError.statusCode);
      return response;
    }
  }
}

module.exports = UsersHandler;
