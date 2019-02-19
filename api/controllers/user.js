const request = require('request-promise');
const router = require('express').Router();

router.post('/login', async (req, res) => {
  // const url = 'https://demo2.wice-net.de/pserv/base/json';
  const url = 'https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json';
  const options = {
    method: 'POST',
    uri: url,
    form: {
      method: 'login',
      mandant_name: req.body.mandant_name,
      username: req.body.username,
      password: req.body.password,
    },
    // headers: { 'X-API-KEY': cfg.apikey }
    json: true,
    resolveWithFullResponse: true,
  };

  try {
    const response = await request(options);
    console.log(response.body);

    if (response.statusCode !== 200) {
      res.status(response.statusCode).send(response.body);
    } else {
      res.status(200).send(response.body);
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
