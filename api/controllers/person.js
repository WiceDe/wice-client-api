/* eslint consistent-return: "off" */
const request = require('request-promise');
const router = require('express').Router();
const { customPerson } = require('../utils/customPerson');
const { verifyServer } = require('../../middlewares/verifyServer');

// @route   GET /api/v1/persons/
// @desc    Get all persons
// @access  Private
router.get('/', verifyServer, async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['x-wice-cookie'];
  const uri = req.server;

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'get_all_persons',
      full_list: 1,
      cookie,
    },
    headers: {
      'X-API-KEY': apiKey,
    },
    json: true,
    resolveWithFullResponse: true,
  };

  try {
    const persons = [];
    const response = await request(options);
    if (response.statusCode !== 200) {
      res.status(response.statusCode).send(response.body);
    } else {
      if (response.body.loop_addresses.length === 0) {
        return res.status(response.statusCode).send('No persons found!');
      }

      response.body.loop_addresses.filter((person) => {
        const currentPerson = customPerson(person);
        return persons.push(currentPerson);
      });

      res.status(response.statusCode).send(persons);
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   POST /api/v1/persons/
// @desc    Create a person
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

  async function checkForExistingPerson(person, cookie) {
    let existingRowid = 0;
    try {
      options.form = {
        method: 'get_all_persons',
        cookie,
        ext_search_do: 1,
        name: person.name,
      };

      const rowid = await request.post(options);
      const rowidObj = JSON.parse(rowid);
      if (rowidObj.loop_addresses) {
        existingRowid = rowidObj.loop_addresses[0].rowid;
        console.log(`Person already exists - ROWID: ${existingRowid}`);
      }
      return existingRowid;
    } catch (e) {
      throw new Error(e);
    }
  }

  async function createOrUpdatePerson(existingRowid, cookie) {
    input.same_contactperson = 'auto';
    const data = JSON.stringify(input);
    try {
      options.form = {
        cookie,
        data,
      };
      if (existingRowid === 0) {
        console.log('Creating person ...');
        options.form.method = 'insert_contact';
        const person = await request.post(options);
        return {
          person,
          status: 'created',
          msg: 'Person created!',
        };
      }
      console.log('Updating person ...');
      input.rowid = existingRowid;
      options.form.method = 'update_contact';
      options.form.data = JSON.stringify(input);
      const person = await request.post(options);
      return {
        person,
        status: 'updated',
        msg: 'Person already exists!',
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  (async function execute() {
    try {
      const cookie = req.headers['x-wice-cookie'];
      const existingRowid = await checkForExistingPerson(input, cookie);
      const result = await createOrUpdatePerson(existingRowid, cookie);
      result.person = customPerson(JSON.parse(result.person));
      if (result.status === 'updated') {
        return res.status(400).send(result);
      }

      return res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }());
});

// @route   GET /api/v1/persons/:rowid
// @desc    Get a person by rowid
// @access  Private
router.get('/:rowid', verifyServer, async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['x-wice-cookie'];
  const { rowid } = req.params;
  const uri = req.server;

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'get_person',
      cookie,
      pkey: rowid,
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
      const person = customPerson(response.body);
      res.status(response.statusCode).send(person);
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   PUT /api/v1/persons/:rowid
// @desc    Update a person by rowid
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
      method: 'update_contact',
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
      // TODO: Custom person format
      res.status(response.statusCode).send({
        rowid: response.body.rowid,
        status: 'updated',
      });
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   DELETE /api/v1/persons/:rowid
// @desc    Delete a person by rowid
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
      method: 'delete_person',
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
      // TODO: Custom person format
      res.status(response.statusCode).send({
        rowid: response.body.rowid,
        status: 'deactivated',
      });
    }
  } catch (e) {
    res.send(e);
  }
});

module.exports = router;
