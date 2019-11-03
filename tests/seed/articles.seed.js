const nock = require('nock');

const getArticles = nock('https://demo.wice-net.de/plugin/wp_wice_client_api_backend/json?method=get_all_articles&full_list=1&cookie=asdfghjkl')
  .post('')
  .reply(200, {
    loop_articles: [{
      rowid: '5759',
      number: '5759',
      description: 'LAN Cabel',
      in_stock: '0',
    }, {
      rowid: '5931',
      number: '5931',
      description: 'WLAN-Router',
      in_stock: '100',
    }],
  });

const createArticle = nock('https://demo.wice-net.de/plugin/wp_wice_client_api_backend/json?method=insert_article&cookie=asdfghjkl')
  .persist()
  .post('')
  .reply(200, {
    rowid: '5821',
    number: '5821',
    description: 'Monitor Acer 27',
    in_stock: '50',
  });


module.exports = { getArticles, createArticle };
