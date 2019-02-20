const request = require('request-promise');
const router = require('express').Router();

// @route   GET /api/v1/person/
// @desc    Get all persons
// @access  Private
router.get('/', async (req, res) => {
  // const url = 'https://demo2.wice-net.de/pserv/base/json';
  const url = 'https://oihwice.wice-net.de/plugin/wp_elasticio_backend/json';
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['wice-cookie'];
  const options = {
    method: 'POST',
    uri: url,
    form: {
      method: 'get_all_persons',
      full_list: 1,
      cookie,
    },
    headers: {
      'X-API-KEY':
       apiKey,
    },
    json: true,
    resolveWithFullResponse: true,
  };

  try {
    const response = await request(options);
    if (response.statusCode !== 200) {
      res.status(response.statusCode).send(response.body);
    } else {
      // TODO: Check if array is empty
      // TODO: Custom person format
      const persons = response.body.loop_addresses;
      console.log(persons.length);
      res.status(response.statusCode).send(persons);
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
