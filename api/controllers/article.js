const request = require('request-promise');
const router = require('express').Router();
const { customArticle } = require('../utils/customArticle');
const { verifyServer } = require('../../middlewares/verifyServer');

// @route   GET /api/v1/articles/
// @desc    Get all articles
// @access  Private
router.get('/', verifyServer, async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['x-wice-cookie'];
  const uri = req.server;

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
    const articles = [];
    const response = await request(options);
    if (response.statusCode !== 200) {
      res.status(response.statusCode).send(response.body);
    } else {
      // TODO: Check if array is empty
      response.body.loop_articles.filter((article) => {
        const currentArticle = customArticle(article);
        return articles.push(currentArticle);
      });

      res.status(response.statusCode).send(articles);
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   POST /api/v1/articles/
// @desc    Create an article
// @access  Private
router.post('/', verifyServer, async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const input = req.body;
  const uri = req.server;

  const options = {
    method: 'POST',
    uri,
    headers: {
      'X-API-KEY': apiKey,
    },
  };

  async function checkForExistingArticle(article, cookie) {
    let existingRowid = 0;
    try {
      options.form = {
        method: 'get_all_articles',
        cookie,
        search_filter: article.description,
      };

      const rowid = await request.post(options);
      const rowidObj = JSON.parse(rowid);
      if (rowidObj.loop_articles) {
        existingRowid = rowidObj.loop_articles[0].rowid;
        console.log(`Article already exists - ROWID: ${existingRowid}`);
      }
      return existingRowid;
    } catch (e) {
      throw new Error(e);
    }
  }

  async function createOrUpdateArticle(existingRowid, cookie) {
    const data = JSON.stringify(input);
    try {
      options.form = {
        cookie,
        data,
      };
      if (existingRowid === 0) {
        console.log('Creating article ...');
        options.form.method = 'insert_article';
        const article = await request.post(options);
        return {
          article,
          status: 'created',
          msg: 'Article created!',
        };
      }
      console.log('Updating article ...');
      input.rowid = existingRowid;
      options.form.method = 'update_article';
      options.form.data = JSON.stringify(input);
      const article = await request.post(options);
      return {
        article,
        status: 'updated',
        msg: 'Article already exists!',
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  (async function execute() {
    try {
      const cookie = req.headers['x-wice-cookie'];
      const existingRowid = await checkForExistingArticle(input, cookie);
      const result = await createOrUpdateArticle(existingRowid, cookie);
      result.article = JSON.parse(result.article);
      if (result.status === 'updated') {
        return res.status(400).send(result);
      }
      // TODO: Check if array is empty
      // TODO: Custom article format

      return res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }());
});

// @route   GET /api/v1/articles/:rowid
// @desc    Get an article by rowid
// @access  Private
router.get('/:rowid', verifyServer, async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['x-wice-cookie'];
  const uri = req.server;

  const { rowid } = req.params;

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
      const article = customArticle(response.body);
      res.status(response.statusCode).send(article);
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   PUT /api/v1/articles/:rowid
// @desc    Update an article by rowid
// @access  Private
router.put('/:rowid', verifyServer, async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['x-wice-cookie'];
  const uri = req.server;
  const input = req.body;
  input.rowid = req.params.rowid;

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'update_article',
      cookie,
      data: JSON.stringify(input),
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
      res.status(response.statusCode).send({
        rowid: response.body.rowid,
        status: 'updated',
      });
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   DELETE /api/v1/articles/:rowid
// @desc    Delete an article by rowid
// @access  Private
router.delete('/:rowid', verifyServer, async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['x-wice-cookie'];
  const uri = req.server;

  const input = {
    rowid: req.params.rowid,
  };

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'delete_article',
      cookie,
      data: JSON.stringify(input),
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
      res.status(response.statusCode).send({
        // rowid: response.body.rowid,
        status: 'deactivated',
      });
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
