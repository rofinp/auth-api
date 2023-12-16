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
  });
});
