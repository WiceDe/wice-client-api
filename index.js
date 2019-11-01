process.env.NODE_CONFIG_DIR = './config';

const express = require('express');
const swaggerUi = require('swagger-ui-express');
const bodyParser = require('body-parser');
const swaggerDocument = require('./api/swagger/swagger.json');
const log = require('./api/utils/logger');

const user = require('./api/controllers/user');
const person = require('./api/controllers/person');
const organization = require('./api/controllers/organization');
const article = require('./api/controllers/article');

app = express();
app.use(bodyParser.json());
app.disable('x-powered-by');

const port = process.env.PORT || 5000;

// This middleware insures we always have security headers
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, Authorization, X-Requested-With, Content-Type, Accept, Options',
  );
  res.append('Strict-Transport-Security', 'max-age=3600');
  res.append('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  res.append('Content-Security-Policy', "frame-ancestors 'none'");
  next();
});

app.get('/healthcheck', (req, res) => {
  res.send({
    status: 'pass',
    version: '0.0.1',
    description: 'Wice CRM Client API',
  });
});

app.use('/api/v1/users', user);
app.use('/api/v1/persons', person);
app.use('/api/v1/organizations', organization);
app.use('/api/v1/articles', article);
log.info('Routes set.');

app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
log.info('Swagger set.');

if (process.env.NODE_ENV !== 'test') {
  app.listen(port, () => {
    log.info(`Server is running on port ${port}`);
  });
}

module.exports = app;
