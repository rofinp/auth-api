const AddUserUseCase = require('../../../../Applications/use_cases/AddUserUseCase');

class UsersHandler {
  constructor(container) {
    this._container = container;
  }

  async postUserHandler(req, res) {
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
  }
}

module.exports = UsersHandler;
