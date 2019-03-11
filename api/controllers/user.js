const request = require('request-promise');
const router = require('express').Router();

// @route   POST /api/v1/users/login
// @desc    Login User
// @access  Private
router.post('/login', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const uri = req.server;

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'login',
      mandant_name: req.body.mandant_name,
      username: req.body.username,
      password: req.body.password,
    },
    headers: {
      'X-API-KEY': apiKey,
    },
    json: true,
    resolveWithFullResponse: true,
  };

  try {
    const response = await request(options);
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
