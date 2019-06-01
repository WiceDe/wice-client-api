module.exports = {
  verifyServer(req, res, next) {
    const host = req.headers['x-wice-server'];
    req.server = `https://${host}/plugin/wp_wice_client_api_backend/json`;
    // req.server = `https://${host}/pserv/base/json`;
    next();
  },
  loginUrl(req, res, next) {
    const host = req.headers['x-wice-server'];
    req.server = `https://${host}/pserv/base/json`;
    next();
  },
};
