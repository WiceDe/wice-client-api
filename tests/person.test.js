/* eslint-disable no-unused-expressions */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const server = require('../index.js');
const log = require('../api/utils/logger');

const {
  getPersons,
  createPerson,
} = require('./seed/persons.seed.js');

chai.use(chaiHttp);

beforeAll(() => {
  getPersons;
  createPerson;
});

describe('Persons - person\'s management', () => {
  it('should return 200 and get all persons', async () => {
    await request(server)
      .get('/api/v1/persons')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.length(2);
        expect(res.body[0].rowid).to.equal('123456');
        expect(res.body[0].mandant).to.equal('sandbox');
        expect(res.body[0].name).to.equal('Smith');
        expect(res.body[0].firstname).to.equal('Mark');
        expect(res.body[0].email).to.equal('smith@company.com');
        expect(res.body[0].title).to.equal('Prof');
        expect(res.body[0].salutation).to.equal('Mr.');
        expect(res.body[0].private_street).to.equal('Main Str.');
        expect(res.body[0].private_street_number).to.equal('120');
        expect(res.body[1].rowid).to.equal('654321');
        expect(res.body[1].mandant).to.equal('sandbox');
        expect(res.body[1].name).to.equal('Stevens');
        expect(res.body[1].firstname).to.equal('Monica');
        expect(res.body[1].email).to.equal('stevens@company.com');
        expect(res.body[1].title).to.equal('');
        expect(res.body[1].salutation).to.equal('Mrs.');
        expect(res.body[1].private_street).to.equal('West Spring Str.');
        expect(res.body[1].private_street_number).to.equal('28');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and get a single person', async () => {
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

  it('should return 200 and create a new person', async () => {
    await request(server)
      .post('/api/v1/persons')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .send({
        firstname: 'Anthony',
        name: 'Hobbs',
        email: 'hobbs@mail.com',
      })
      .then((res) => {
        expect(res.body.status).to.equal('created');
        expect(res.body.msg).to.equal('Person created!');
        expect(res.body.person.name).to.equal('Hobbs');
        expect(res.body.person.firstname).to.equal('Anthony');
        expect(res.body.person.email).to.equal('hobbs@mail.com');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and update a person', async () => {
    await request(server)
      .put('/api/v1/persons/13579')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .send({
        firstname: 'Anthony',
        name: 'Brown',
        email: 'hobbs@mail.com',
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
      .delete('/api/v1/persons/13579')
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
