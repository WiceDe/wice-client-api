/* eslint no-return-assign: "off" */
/* eslint no-param-reassign: "off" */
const puppeteer = require('puppeteer');
const keys = require('../config/keys.js');

const width = 1920;
const height = 1080;
let browser;
let page;

// Setup page
beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-dev-shm-usage', `--window-size=${width},${height}`],
    // slowMo: 10,
  });
  page = await browser.newPage();
  await page.setViewport({ width, height });
  await page.goto('localhost:5000');
  await page.select('.servers > label:nth-child(1) > select:nth-child(1)', 'http://localhost:5000/');
});

// afterAll(async () => {
//   await browser.close();
// });

// Setup for each test
// beforeEach(async () => {
//   browser = await puppeteer.launch({
//     headless: false,
//     args: ['--disable-dev-shm-usage'],
//   });
//   page = await browser.newPage();
//   await page.setViewport({ width: 1280, height: 1024 });
//   await page.goto('localhost:5000');
// });
//
// afterEach(async () => {
//   // await browser.close();
// });

// test('if the header has the correct subtitle', async () => {
//   const desc = await page.$eval('.renderedMarkdown > p', el => el.innerHTML);
//   expect(desc).toEqual('This is a client API for Wice CRM');
// });
//
// test('user login functionality', async (done) => {
//   const credentials = {
//     mandant_name: keys.mandant_name,
//     username: keys.username,
//     password: keys.password,
//     apiKey: keys.apiKey,
//   };
//
//   // Open 'Authorize' popup
//   await page.click('.btn.authorize');
//   await page.waitForSelector('.modal-ux-content input');
//
//   // Input a server
//   const inputServer = '.modal-ux-content .auth-container:nth-child(3) input';
//   await page.$eval(inputServer, el => el.value = '');
//   await page.focus(inputServer);
//   await page.type(inputServer, 'oihwice.wice-net.de');
//   await page.click('.auth-container:nth-child(3) button');
//   await page.click('.auth-container:nth-child(3) .btn-done');
//   // await page.click('.auth-btn-wrapper:nth-child(3) button[type="submit"]');
//
//   // Find login route and input login credentials
//   const handle = '.opblock-summary.opblock-summary-post';
//   const inputCredentials = JSON.stringify(credentials);
//   const apiKey = '                                      ';
//   // const apiKey = keys.apiKey;
//   await page.waitForSelector(handle);
//   await page.click(handle);
//   await page.waitForSelector('.try-out__btn');
//   await page.click('.try-out__btn');
//   await page.waitForSelector('.body-param__text');
//   await page.focus('.body-param__text');
//   await page.$eval('.body-param__text', el => el.value = '');
//   await page.type('.body-param__text', inputCredentials);
//   await page.click('.opblock-control__btn');
//
//   // Get the cookie from response
//   const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
//   const response = await page.evaluate(el => el.textContent, element);
//   const jsonResponse = JSON.parse(response);
//   const { cookie } = jsonResponse;
//   expect(response).toContain('cookie');
//   expect(cookie).toBeTruthy();
//   expect(cookie.length).not.toEqual(0);
//
//   // Open 'Authorize' popup
//   await page.click('.schemes .auth-wrapper .authorize');
//   await page.waitForSelector('.modal-ux-content input');
//
//   // Input API-KEY
//   const inputApi = '.modal-ux-content input';
//   await page.$eval(inputApi, el => el.value = '');
//   await page.focus(inputApi);
//   await page.type(inputApi, apiKey);
//   await page.click('.modal-ux-content button[type="submit"]');
//
//   // Input cookie
//   // await page.waitForSelector('.modal-ux-content:nth-child(2) input');
//   const inputCookie = '.modal-ux-content .auth-container:nth-child(2) input';
//   await page.$eval(inputCookie, el => el.value = '');
//   await page.focus(inputCookie);
//   await page.type(inputCookie, cookie);
//   // await page.waitForSelector('.modal-ux-content:nth-child(2) button[type="submit"]');
//   await page.click('.modal-ux-content:nth-child(2) button[type="submit"]');
//   await page.click('.modal-ux-content .btn-done');
//   await page.click('.opblock-summary-path');
//   done();
// }, 8000);

test('get all articless', async (done) => {
  // Find the route for getting persons
  // TODO: change handle
  const handle = '#operations-article-get_api_v1_articles';
  await page.waitForSelector(handle);
  await page.click(handle);
  // TODO: Make sure that the right submit button is clicked because it has the same class
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.click('.execute');
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  expect(jsonResponse).toBeInstanceOf(Array);

  // Check for a specific article
  // expect(jsonResponse[3].rowid).toBe('414426');
  // expect(jsonResponse[3].name).toBe('Monica');
  // expect(jsonResponse[3].firstname).toBe('Federle');
  // expect(jsonResponse[3].email).toBe('');

  // Check the last articles
  const last = jsonResponse.length - 1;
  // TODO: Get the right response after execution
  expect(jsonResponse[last].rowid).toBe(414360);
  expect(jsonResponse[last].name).toBe('Soltero');
  expect(jsonResponse[last].firstname).toBe('Carlos ');
  expect(jsonResponse[last].email).toBe('');

  // Close the toggle
  // TODO: change the selector and click event attribute
  await page.waitForSelector('a[href="#/article/get_api_v1_articles"]');
  await page.click('a[href="#/article/get_api_v1_articles"]');
  done();
}, 8000);

test('get a single article by a rowid', async (done) => {
  // Find the route for getting a single article
  // TODO: change the route for articles
  const route = '#operations-article-get_api_v1_persons__rowid_';
  const handle = 'tr[data-param-name="rowid"] input';
  await page.waitForSelector(route);
  await page.click(route);
  // Make sure the click the right button because of class repitition
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('tr[data-param-name="rowid"] input');
  await page.focus(handle);
  await page.$eval(handle, el => el.value = '');
  // TODO: change the rowid with an article rowid
  await page.type(handle, '414426');
  await page.click('.execute');
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');

  // Check if the reposne is an object
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  expect(jsonResponse).toBeInstanceOf(Object);

  // // Check property values for the specific article
  // TODO: change assertions to match expect values
  // TODO: Get the real values from the repsosnse
  expect(jsonResponse.rowid).toBe(414426);
  expect(jsonResponse.name).toBe('Monica');
  expect(jsonResponse.firstname).toBe('Federle');
  expect(jsonResponse.email).toBe('');
  // TODO: remove same_contactperson
  expect(jsonResponse.same_contactperson).toBe(0);
  // expect(jsonResponse.deactivated).toBe('0');

  // Close the toggle
  // TODO: change selector and click event
  await page.waitForSelector('a[href="#/article/get_api_v1_articles__rowid_"]');
  await page.click('a[href="#/article/get_api_v1_persons__rowid_"]');
  done();
}, 8000);
//
test('create an article', async (done) => {
  // Find the route for getting a single article
  // const handle = 'tr[data-param-name="rowid"] input';
  // TODO: Create an article object for creation
  const article = '{"description": "Sound System Bose", "price": "550", "amount": "10"}';
  // TODO: Change the route
  const route = '#operations-article-post_api_v1_articles';
  await page.waitForSelector(route);
  await page.click(route);
  // TODO: make sure the rigt submit buttons is clicked because it has the same class
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('.body-param__text');
  await page.focus('.body-param__text');
  await page.$eval('.body-param__text', el => el.value = '');
  await page.type('.body-param__text', article);
  await page.click('.opblock-control__btn');

  // Get the response
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  // TODO: Change asseriotns to match the resposnse
  expect(jsonResponse.article.rowid).not.toBe('');
  expect(jsonResponse.status).toBe('updated');
  expect(jsonResponse.msg).toBe('Article already exists!');

  // Close the toggle
  // TODO: change selector and click event
  await page.waitForSelector('#operations-article-post_api_v1_articles > .opblock-summary-post');
  await page.click('#operations-article-post_api_v1_persons > .opblock-summary-post');
  done();
}, 8000);

test('update a single article', async (done) => {
  // Find the route for updating article
  // TODO: create article object which must be updated
  const article = '{"name": "Monica"}';
  // TODO: Change the route to article
  const route = '#operations-article-put_api_v1_articles__rowid_';
  const handle = 'tr[data-param-name="rowid"] input';
  await page.waitForSelector(route);
  await page.click(route);
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('tr[data-param-name="rowid"] input');
  await page.focus(handle);
  await page.$eval(handle, el => el.value = '');
  await page.type(handle, '414426');
  await page.focus('.body-param__text');
  await page.$eval('.body-param__text', el => el.value = '');
  await page.type('.body-param__text', article);
  await page.click('.execute');
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');

  // Check if the reposne is an object
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  expect(jsonResponse).toBeInstanceOf(Object);

  // Check property values for the specific article
  // TODO: change the rowid from the reposnse
  expect(jsonResponse.rowid).toBe('414426');
  expect(jsonResponse.status).toBe('updated');

  // Close the toggle
  // TODO: change the selector and the click event
  await page.waitForSelector('#operations-article-put_api_v1_articles__rowid_ > .opblock-summary-put');
  await page.click('#operations-article-put_api_v1_articles__rowid_ > .opblock-summary-put');
  done();
}, 8000);

test('delete a single article', async (done) => {
  // Find the route for deleting an article
  // TODO: change the route
  const route = '#operations-article-delete_api_v1_articles__rowid_';
  const handle = 'tr[data-param-name="rowid"] input';
  await page.waitForSelector(route);
  await page.click(route);
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('tr[data-param-name="rowid"] input');
  await page.focus(handle);
  await page.$eval(handle, el => el.value = '');
  await page.type(handle, '414426');

  await page.click('.execute');
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');

  // Check if the reposne is an object
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  expect(jsonResponse).toBeInstanceOf(Object);

  //  Check property values for the specific article
  // TODO: change assertions to match response
  expect(jsonResponse.rowid).toBe('414426');
  expect(jsonResponse.status).toBe('deactivated');

  // Close the toggle
  // TODO: change selector and click event attribute
  await page.waitForSelector('#operations-article-delete_api_v1_articles__rowid_ > .opblock-summary-delete');
  await page.click('#operations-article-delete_api_v1_persons__rowid_ > .opblock-summary-delete');
  done();
}, 8000);
