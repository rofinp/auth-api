const routes = (handler) => [
  {
    method: 'POST',
    path: '/authentications',
    handler: (req, res) => handler.postAuthenticationHandler(req, res),
  },
  {
    method: 'PUT',
    path: '/authentications',
    handler: (req) => handler.putAuthenticationHandler(req),
  },
  {
    method: 'DELETE',
    path: '/authentications',
    handler: (req) => handler.deleteAuthenticationHandler(req),
  },
];

module.exports = routes;
