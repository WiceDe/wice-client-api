/* eslint-disable no-unused-expressions */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const server = require('../index.js');
const log = require('../api/utils/logger');

const {
  getOrganizations,
  createOrganization,
} = require('./seed/organizations.seed.js');

chai.use(chaiHttp);

beforeAll(() => {
  getOrganizations;
  createOrganization;
});

describe('Organizations - organization\'s management', () => {
  it('should return 200 and get all organizations', async () => {
    await request(server)
      .get('/api/v1/organizations')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.length(2);
        expect(res.body[0].rowid).to.equal('873539');
        expect(res.body[0].name).to.equal('Company Ltd.');
        expect(res.body[0].email).to.equal('info@company.com');
        expect(res.body[0].phone).to.equal('82152587588');
        expect(res.body[0].street).to.equal('Main Str.');
        expect(res.body[0].street_number).to.equal('441');
        expect(res.body[0].state).to.equal('New York');
        expect(res.body[1].rowid).to.equal('821528');
        expect(res.body[1].name).to.equal('Organization Ltd.');
        expect(res.body[1].email).to.equal('info@organization.com');
        expect(res.body[1].phone).to.equal('82152587588');
        expect(res.body[1].street).to.equal('Long Beach Str.');
        expect(res.body[1].street_number).to.equal('41');
        expect(res.body[1].state).to.equal('California');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  xit('should return 200 and get a single person', async () => {
    await request(server)
      .get('/api/v1/persons/13579')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.name).to.equal('Hobbs');
        expect(res.body.firstname).to.equal('Anthony');
        expect(res.body.email).to.equal('hobbs@mail.com');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and create a new organization', async () => {
    await request(server)
      .post('/api/v1/organizations')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .send({
        name: 'Company Ltd.',
        email: 'info@company.com',
      })
      .then((res) => {
        expect(res.body.status).to.equal('created');
        expect(res.body.msg).to.equal('Organization created!');
        expect(res.body.organization.name).to.equal('Company Ltd.');
        expect(res.body.organization.email).to.equal('info@company.com');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and update an organization', async () => {
    await request(server)
      .put('/api/v1/organizations/13579')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .send({
        name: 'Company Ltd.',
        email: 'info@company.com',
      })
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('updated');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and delete a person', async () => {
    await request(server)
      .delete('/api/v1/organizations/13579')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')

      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.status).to.equal('deactivated');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });
});
