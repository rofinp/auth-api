const pool = require('../../database/postgres/pool');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const createServer = require('../createServer');

describe('HTTP Server', () => {
  afterEach(async () => {
    await UsersTableTestHelper.cleanTable();
  });

  afterAll(async () => {
    await pool.end();
  });

  it('should response with a 404 status code when request to an unregistered route', async () => {
    // Arrange
    const server = await createServer({});

    // Action
    const response = await server.inject({
      method: 'GET',
      url: '/unregisteredRoute',
    });

    // Assert
    expect(response.statusCode).toEqual(404);
  });

  describe('when POST to path /users', () => {
    it('should respond with a 201 status code and persist the user', async () => {
      // Arrange
      const requestPayload = {
        username: 'alditaher',
        password: 'alditaher007',
        fullname: 'Aldi Taher',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201); // created
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.addedUser).toBeDefined();
    });

    it('should respond with a 400 status code when the request payload is missing a required property', async () => {
      // Arrange
      const requestPayload = {
        fullname: 'Aldi Taher',
        password: 'alditaher007',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new user: the required property does not exist');
    });

    it('should respond with a 400 status code when the request payload violates the data type specification', async () => {
      // Arrange
      const requestPayload = {
        username: 'alditaher',
        password: 'alditaher007',
        fullname: ['Aldi Taher'],
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new user: the data type does not meet the specification');
    });

    it('should respond with a 400 status code when the username exceeds 50 characters', async () => {
      // Arrange
      const requestPayload = {
        username: 'alditaheralditaheralditaheralditaheralditaheralditaher',
        password: 'alditaher007',
        fullname: 'Aldi Taher',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new user: the username exceeds 50 characters');
    });

    it('should respond with a 400 status code when the username contains a prohibited character', async () => {
      // Arrange
      const requestPayload = {
        username: '~alditaher~',
        password: 'alditaher007',
        fullname: 'Aldi Taher',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('cannot create new user: the username contains a prohibited character');
    });

    it('should respond with a 400 status code when the requested username is already taken', async () => {
      // Arrange
      await UsersTableTestHelper.addUser({ username: 'alditaher' });
      const requestPayload = {
        username: 'alditaher',
        password: 'alditaher007',
        fullname: 'Aldi Taher',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username is not available');
    });

    it('should handle server error correctly', async () => {
      // Arrange
      const requestPayload = {
        username: 'alditaher',
        password: 'alditaher007',
        fullname: 'Aldi Taher',
      };
      const server = await createServer({}); // fake container

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/users',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(500);
      expect(responseJson.status).toEqual('error');
      expect(responseJson.message).toEqual('a failure occurred on our servers');
    });
  });
});
