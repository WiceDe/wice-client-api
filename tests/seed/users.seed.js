const nock = require('nock');

const userLogin = nock('https://demo.wice-net.de/pserv/base/json?method=login&mandant_name=sandbox&username=john&password=foo')
  .post('')
  .reply(200, { cookie: 'c67as0asd78a1safa' });

module.exports = { userLogin };
