const Hapi = require('@hapi/hapi');
const ClientError = require('../../Commons/exceptions/ClientError');
const DomainErrorTranslator = require('../../Commons/exceptions/DomainErrorTranslator');
const users = require('../../Interfaces/http/api/users');
const authentications = require('../../Interfaces/http/api/authentications');

const createServer = async (container) => {
  const server = Hapi.server({
    host: process.env.HOST,
    port: process.env.PORT,
  });

  await server.register([
    {
      plugin: users,
      options: { container },
    },
    {
      plugin: authentications,
      options: { container },
    },
  ]);

  server.ext('onPreResponse', (req, res) => {
    const { response } = req;
    if (response instanceof Error) {
      // if the response is an error, handle it as needed
      const translatedError = DomainErrorTranslator.translate(response);

      // internal handling of client errors
      if (translatedError instanceof ClientError) {
        const newResponse = res.response({
          status: 'fail',
          message: translatedError.message,
        });
        newResponse.code(translatedError.statusCode);
        return newResponse;
      }

      // maintains client error handling by HAPI natively, such as 404, etc.
      if (!translatedError.isServer) {
        return res.continue;
      }

      // server error handling as needed
      const newResponse = res.response({
        status: 'error',
        message: 'a failure occurred on our servers',
      });
      newResponse.code(500);
      return newResponse;
    }

    //  if it's not an error, continue with the previous response (without intervention)
    return res.continue;
  });

  return server;
};

module.exports = createServer;
