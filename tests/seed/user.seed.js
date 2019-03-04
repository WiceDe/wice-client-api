const nock = require('nock');

const loginUser = nock('http://localhost:5000')
  .post('/api/v1/users/login')
  .reply(200, {
    cookie: 'fsuogsi9p1im1gpnhvapjdtx94z46qye',
  });

module.exports = {
  loginUser,
};
