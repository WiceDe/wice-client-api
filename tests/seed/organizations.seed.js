const nock = require('nock');

const getOrganizations = nock('https://demo.wice-net.de/plugin/wp_wice_client_api_backend/json?method=get_all_companies&full_list=1&cookie=asdfghjkl')
  .post('')
  .reply(200, {
    loop_addresses: [{
      rowid: '873539',
      mandant: 'sandbox',
      name: 'Company Ltd.',
      email: 'info@company.com',
      street: 'Main Str.',
      street_number: '441',
      zip_code: '10016',
      p_o_box: 'B41C',
      town: 'New York City',
      state: 'New York',
      country: 'USA',
      phone: '82152587588',
      fax: '82759871528',
    }, {
      rowid: '821528',
      mandant: 'sandbox',
      name: 'Organization Ltd.',
      email: 'info@organization.com',
      street: 'Long Beach Str.',
      street_number: '41',
      zip_code: '94088',
      p_o_box: 'B41C',
      town: 'San Jose',
      state: 'California',
      country: 'USA',
      phone: '82152587588',
      fax: '82759871528',
    }],
  });

const createOrganization = nock('https://demo.wice-net.de/plugin/wp_wice_client_api_backend/json?method=insert_company&cookie=asdfghjkl')
  .persist()
  .post('')
  .reply(200, {
    name: 'Company Ltd.',
    email: 'info@company.com',
  });


module.exports = { createOrganization, getOrganizations };
