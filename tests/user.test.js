/* eslint-disable no-unused-expressions */
/* eslint no-underscore-dangle: "off" */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const server = require('../index.js');
const log = require('../api/utils/logger');

const {
  userLogin,
} = require('./seed/users.seed.js');

chai.use(chaiHttp);

beforeAll(() => {
  userLogin;
});

describe.only('Authentication - User login', () => {
  test('should return 200 and a cookie', async () => {
    await request(server)
      .post('/api/v1/users/login')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .send({
        mandant_name: 'sandbox',
        username: 'john',
        password: 'foo',
      })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.cookie).to.equal('c67as0asd78a1safa');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });
});
