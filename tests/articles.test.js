/* eslint-disable no-unused-expressions */

process.env.NODE_ENV = 'test';

const chai = require('chai');
const { expect } = require('chai');
const chaiHttp = require('chai-http');
const request = require('supertest');
const server = require('../index.js');
const log = require('../api/utils/logger');

const {
  getArticles,
  createArticle,
} = require('./seed/articles.seed.js');

chai.use(chaiHttp);

beforeAll(() => {
  getArticles;
  createArticle;
});

describe('Articles - articles\'s management', () => {
  it('should return 200 and get all articles', async () => {
    await request(server)
      .get('/api/v1/articles')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.have.length(2);
        expect(res.body[0].rowid).to.equal('5759');
        expect(res.body[0].number).to.equal('5759');
        expect(res.body[0].description).to.equal('LAN Cabel');
        expect(res.body[0].in_stock).to.equal('0');
        expect(res.body[1].rowid).to.equal('5931');
        expect(res.body[1].number).to.equal('5931');
        expect(res.body[1].description).to.equal('WLAN-Router');
        expect(res.body[1].in_stock).to.equal('100');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and get a single article', async () => {
    await request(server)
      .get('/api/v1/articles/13579')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .then((res) => {
        expect(res).to.have.status(200);
        expect(res.body.description).to.equal('Monitor Acer 27');
        expect(res.body.rowid).to.equal('5821');
        expect(res.body.number).to.equal('5821');
        expect(res.body.in_stock).to.equal('50');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and create a new article', async () => {
    await request(server)
      .post('/api/v1/articles')
      .set('x-wice-server', 'demo.wice-net.de')
      .set('x-wice-cookie', 'asdfghjkl')
      .set('x-api-key', '1234567890')
      .send({
        name: 'Company Ltd.',
        email: 'info@company.com',
      })
      .then((res) => {
        expect(res.body.status).to.equal('created');
        expect(res.body.msg).to.equal('Article created!');
        expect(res.body.article.description).to.equal('Monitor Acer 27');
        expect(res.body.article.in_stock).to.equal('50');
      })
      .catch((err) => {
        log.debug(err);
        throw err;
      });
  });

  it('should return 200 and update an article', async () => {
    await request(server)
      .put('/api/v1/articles/13579')
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

  it('should return 200 and delete a articles', async () => {
    await request(server)
      .delete('/api/v1/articles/13579')
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
