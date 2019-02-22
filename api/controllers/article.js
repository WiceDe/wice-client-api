const request = require('request-promise');
const router = require('express').Router();
const {
  uri
} = require('../../config/keys');

// @route   GET /api/v1/article/
// @desc    Get all articles
// @access  Private
router.get('/', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['wice-cookie'];

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'get_all_articles',
      cookie,
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
      // TODO: Check if array is empty
      // TODO: Custom article format
      const articles = response.body.loop_articles;
      console.log(articles.length);
      res.status(response.statusCode).send(articles);
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   GET /api/v1/article/:rowid
// @desc    Get an article by rowid
// @access  Private
router.get('/:rowid', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['wice-cookie'];
  const {
    rowid
  } = req.params;

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'get_article',
      cookie,
      show_detailview: rowid,
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
      // TODO: Check if array is empty
      // TODO: Custom article format
      res.status(response.statusCode).send(response.body);
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;