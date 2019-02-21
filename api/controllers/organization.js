const request = require('request-promise');
const router = require('express').Router();
const { uri } = require('../../config/keys');

// @route   GET /api/v1/organization/
// @desc    Get all organizations
// @access  Private
router.get('/', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['wice-cookie'];

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'get_all_companies',
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
