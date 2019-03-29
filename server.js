process.env.NODE_CONFIG_DIR = './config';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const { verifyServer } = require('./middlewares/verifyServer');
const swaggerDocument = require('./api/swagger/swagger.json');
const log = require('./api/utils/logger');

const user = require('./api/controllers/user');
const person = require('./api/controllers/person');
const organization = require('./api/controllers/organization');
const article = require('./api/controllers/article');

class Server {
  constructor() {
    this.app = express();
    this.app.use(bodyParser.json());
    this.app.use(verifyServer);
    this.app.disable('x-powered-by');

    // This middleware insures we always have security headers
    this.app.use((req, res, next) => {
      res.header('Access-Control-Allow-Origin', '*');
      res.header('Access-Control-Allow-Headers', 'Origin, Authorization, X-Requested-With, Content-Type, Accept, Options');
      res.append('Strict-Transport-Security', 'max-age=3600');
      res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
      if (req.method === 'OPTIONS') {
        return res.status(200).end();
      }
      // res.append('Content-Security-Policy', "default-src 'self'");
      res.append('Content-Security-Policy', "frame-ancestors 'none'");
      next();
    });
  }

  setupRoutes() {
    log.info('Setting up routes...');

    this.app.get('/healthcheck', (req, res) => {
      res.send({
        status: 'pass',
        version: '0.0.1',
        description: 'Wice CRM Client API',
      });
    });

    this.app.use('/api/v1/users', user);
    this.app.use('/api/v1/persons', person);
    this.app.use('/api/v1/organizations', organization);
    this.app.use('/api/v1/articles', article);

    log.info('Routes set.');
  }

  setupSwagger() {
    log.info('Setting up Swagger API...');
    this.app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
  }

  listen(port) {
    log.info(`Server is running on port: ${port}`);
    const cport = typeof port !== 'undefined' ? port : 5000;
    return this.app.listen(cport);
  }
}

module.exports = Server;
