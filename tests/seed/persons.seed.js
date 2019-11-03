const nock = require('nock');

const getPersons = nock('https://demo.wice-net.de/plugin/wp_wice_client_api_backend/json?method=get_all_persons&full_list=1&cookie=asdfghjkl')
  .post('')
  .reply(200, {
    loop_addresses: [{
      rowid: '123456',
      mandant: 'sandbox',
      for_rowid: '09876',
      same_contactperson: '12458',
      last_update: '12345679',
      deactivated: '0',
      name: 'Smith',
      firstname: 'Mark',
      email: 'smith@company.com',
      title: 'Prof',
      salutation: 'Mr.',
      birthday: '18.12.1970',
      private_street: 'Main Str.',
      private_street_number: '120',
      private_zip_code: '09321',
      private_town: 'Boston',
      private_state: 'MA',
      private_country: 'USA',
      phone: '1792315323',
      fax: '1792315328',
      private_phone: '193240234',
      private_mobile_phone: '1783294302',
      private_email: 'smit@mail.com',
    }, {
      rowid: '654321',
      mandant: 'sandbox',
      for_rowid: '04837',
      same_contactperson: '12458',
      last_update: '65437654',
      deactivated: '0',
      name: 'Stevens',
      firstname: 'Monica',
      email: 'stevens@company.com',
      title: '',
      salutation: 'Mrs.',
      birthday: '11.03.1982',
      private_street: 'West Spring Str.',
      private_street_number: '28',
      private_zip_code: '09311',
      private_town: 'New Hampshire',
      private_state: 'MA',
      private_country: 'USA',
      phone: '1794562397',
      fax: '1794562388',
      private_phone: '1737383903',
      private_mobile_phone: '1783629812',
      private_email: 'stevens@mail.com',
    }],
  });

const createPerson = nock('https://demo.wice-net.de/plugin/wp_wice_client_api_backend/json?method=insert_contact&cookie=asdfghjkl')
  .persist()
  .post('')
  .reply(200, {
    firstname: 'Anthony',
    name: 'Hobbs',
    email: 'hobbs@mail.com',
  });


module.exports = { createPerson, getPersons };
