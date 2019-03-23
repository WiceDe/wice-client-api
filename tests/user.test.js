/* eslint-disable no-unused-expressions */
/* eslint no-underscore-dangle: "off" */

process.env.NODE_ENV = 'test';

// const nock = require('nock');
const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const server = require('../index.js');
const log = require('../api/utils/logger');

// const {
//   loginUser,
// } = require('./seed/user.seed');

chai.use(chaiHttp);

describe('/ - Wice CRM API Documentation', () => {
  it('should display the swagger-generated HTML page', (done) => {
    request(server)
      .get('/')
      .then((res) => {
        expect(res.text).to.not.be.empty;
        expect(res.text).to.contain(
          'HTML for static distribution bundle build',
        );
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      })
      .then(done());
  });
});
