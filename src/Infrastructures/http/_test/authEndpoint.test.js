const AuthenticationsTableTestHelper = require('../../../../tests/AuthenticationsTableTestHelper');
const UsersTableTestHelper = require('../../../../tests/UsersTableTestHelper');
const container = require('../../container');
const pool = require('../../database/postgres/pool');
const createServer = require('../createServer');

describe('/authentications endpoint', () => {
  afterAll(async () => {
    await pool.end();
  });
  afterEach(async () => {
    await AuthenticationsTableTestHelper.cleanTable();
    await UsersTableTestHelper.cleanTable();
  });

  describe('when POST /authentications', () => {
    it('should throw an error when username is not found', async () => {
      // Arrange
      const loginPayload = {
        username: 'alditaher',
        password: 'alditaher007',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('username tidak ditemukan');
    });

    it('should respond with a 400 status code when the request payload is missing a required property', async () => {
      // Arrange
      const loginPayload = {
        username: 'alditaher',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat melakukan login karena properti yang dibutuhkan tidak ada');
    });

    it('should respond with a 400 status code when the request payload violates the data type specification', async () => {
      // Arrange
      const loginPayload = {
        username: 123,
        password: 'test',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('tidak dapat melakukan login karena tipe data tidak sesuai');
    });

    it('should response with statusCode 201 and new authentications', async () => {
      // Arrange
      const loginPayload = {
        username: 'alditaher',
        password: 'alditaher007',
      };
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alditaher',
          password: 'alditaher007',
          fullname: 'Aldi Taher',
        },
      });

      // Action
      const response = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: loginPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(201);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
      expect(responseJson.data.refreshToken).toBeDefined();
    });
  });

  describe('when PUT /authentications', () => {
    it('should return statusCode 400 when refreshToken is not a string', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token harus string');
    });

    it('should return statusCode 400 if payload is not contain refreshToken', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak ditemukan pada payload');
    });

    it('should return statusCode 400 when refreshToken not valid', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: 'refresh_token',
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
      expect(responseJson.message).toEqual('refresh token tidak valid');
    });

    it('should response 200 and get new accessToken', async () => {
      // Arrange
      const server = await createServer(container);

      // add User
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alditaher',
          password: 'alditaher007',
          fullname: 'Aldi Taher',
        },
      });

      // Login user
      const loginResponse = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alditaher',
          password: 'alditaher007',
        },
      });

      const { data: { refreshToken } } = JSON.parse(loginResponse.payload);

      // Action
      const response = await server.inject({
        method: 'PUT',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
      expect(responseJson.data.accessToken).toBeDefined();
    });
  });

  describe('when DELETE /authentications', () => {
    it('should return statusCode 400 when refresh token is not a string', async () => {
      // Arrange
      const requestPayload = {
        refreshToken: true,
      };
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: requestPayload,
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return 400 if the payload is not contain refresh token', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {},
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return statusCode 400 when refresh token is not available in the database', async () => {
      // Arrange
      const server = await createServer(container);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: {
          refreshToken: 'refresh_token',
        },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(400);
      expect(responseJson.status).toEqual('fail');
    });

    it('should return statusCode 200 when successfuly deleted refresh token in the database', async () => {
      // Arrange
      const server = await createServer(container);

      // add user
      await server.inject({
        method: 'POST',
        url: '/users',
        payload: {
          username: 'alditaher',
          password: 'alditaher007',
          fullname: 'Aldi Taher',
        },
      });

      // post authentication
      const responseLogin = await server.inject({
        method: 'POST',
        url: '/authentications',
        payload: {
          username: 'alditaher',
          password: 'alditaher007',
        },
      });

      const { data: { refreshToken } } = JSON.parse(responseLogin.payload);

      // Action
      const response = await server.inject({
        method: 'DELETE',
        url: '/authentications',
        payload: { refreshToken },
      });

      // Assert
      const responseJson = JSON.parse(response.payload);
      expect(response.statusCode).toEqual(200);
      expect(responseJson.status).toEqual('success');
    });
  });
});
