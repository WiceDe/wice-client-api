const Server = require('./server');
const log = require('./api/utils/logger');

const server = new Server();

(() => {
  try {
    server.setupRoutes();
    server.setupSwagger();

    if (!module.parent) {
      server.listen(process.env.PORT || 5000);
    } else {
      module.exports = server.listen();
    }
  } catch (err) {
    log.error(err);
  }
})();
