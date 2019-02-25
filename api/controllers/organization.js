const request = require('request-promise');
const router = require('express').Router();
const { uri } = require('../../config/keys');
const { customOrganization } = require('../../utils/customOrganization');

// @route   GET /api/v1/organizations/
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
    const organizations = [];
    const response = await request(options);
    if (response.statusCode !== 200) {
      res.status(response.statusCode).send(response.body);
    } else {
      // TODO: Check if array is empty

      response.body.loop_addresses.filter((organization) => {
        const currentOrganization = customOrganization(organization);
        return organizations.push(currentOrganization);
      });

      res.status(response.statusCode).send(organizations);
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   POST /api/v1/organizations/
// @desc    Create an organization
// @access  Private
router.post('/', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const input = req.body;

  const options = {
    method: 'POST',
    uri,
    headers: {
      'X-API-KEY': apiKey,
    },
  };

  async function checkForExistingOrganization(organization, cookie) {
    let existingRowid = 0;
    try {
      options.form = {
        method: 'get_all_companies',
        cookie,
        ext_search_do: 1,
        name: organization.name,
      };

      const rowid = await request.post(options);
      const rowidObj = JSON.parse(rowid);
      if (rowidObj.loop_addresses) {
        existingRowid = rowidObj.loop_addresses[0].rowid;
        console.log(`Organization already exists - ROWID: ${existingRowid}`);
      }
      return existingRowid;
    } catch (e) {
      throw new Error(e);
    }
  }

  async function createOrUpdateOrganization(existingRowid, cookie) {
    const data = JSON.stringify(input);
    try {
      options.form = {
        cookie,
        data,
      };
      if (existingRowid === 0) {
        console.log('Creating organization ...');
        options.form.method = 'insert_company';
        const organization = await request.post(options);
        return {
          organization,
          status: 'created',
          msg: 'Organization created!',
        };
      }
      console.log('Updating organization ...');
      input.rowid = existingRowid;
      options.form.method = 'update_company';
      options.form.data = JSON.stringify(input);
      const organization = await request.post(options);
      return {
        organization,
        status: 'updated',
        msg: 'Organization already exists!.',
      };
    } catch (e) {
      throw new Error(e);
    }
  }

  (async function execute() {
    try {
      const cookie = req.headers['wice-cookie'];
      const existingRowid = await checkForExistingOrganization(input, cookie);
      const result = await createOrUpdateOrganization(existingRowid, cookie);
      result.organization = customOrganization(JSON.parse(result.organization));
      if (result.status === 'updated') {
        return res.status(400).send(result);
      }
      // TODO: Check if array is empty
      // TODO: Custom organization format

      return res.status(200).send(result);
    } catch (e) {
      throw new Error(e);
    }
  }());
});

// @route   GET /api/v1/organizations/:rowid
// @desc    Get an organization by rowid
// @access  Private
router.get('/:rowid', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['wice-cookie'];
  const { rowid } = req.params;

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'get_company',
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
      const orgnaization = customOrganization(response.body);
      res.status(response.statusCode).send(orgnaization);
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   PUT /api/v1/organizations/:rowid
// @desc    Update an organization by rowid
// @access  Private
router.put('/:rowid', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['wice-cookie'];
  const input = req.body;
  input.rowid = req.params.rowid;

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'update_company',
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
      // TODO: Custom organization format
      res.status(response.statusCode).send({
        rowid: response.body.rowid,
        status: 'updated',
      });
    }
  } catch (e) {
    res.send(e);
  }
});

// @route   DELETE /api/v1/organizations/:rowid
// @desc    Delete a organization by rowid
// @access  Private
router.delete('/:rowid', async (req, res) => {
  const apiKey = req.headers['x-api-key'];
  const cookie = req.headers['wice-cookie'];

  const input = {
    rowid: req.params.rowid,
  };

  const options = {
    method: 'POST',
    uri,
    form: {
      method: 'delete_company',
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
      // TODO: Custom organization format
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
