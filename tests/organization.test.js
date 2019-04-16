/* eslint no-return-assign: "off" */
/* eslint no-param-reassign: "off" */
/* eslint max-len: "off" */
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

afterAll(async () => {
  await browser.close();
});

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

// afterEach(async () => {
// await browser.close();
// });

// test('if the header has the correct subtitle', async () => {
//   const desc = await page.$eval('.renderedMarkdown > p', el => el.innerHTML);
//   expect(desc).toEqual('This is a client API for Wice CRM');
// });
//
test('Organization - user login functionality', async (done) => {
  const credentials = {
    mandant_name: keys.mandant_name,
    username: keys.username,
    password: keys.password,
    apiKey: keys.apiKey,
  };

  // Open 'Authorize' popup
  await page.click('.btn.authorize');
  await page.waitForSelector('.modal-ux-content input');

  // // Input a server
  const inputServer = '.modal-ux-content .auth-container:nth-child(3) input';
  await page.$eval(inputServer, el => el.value = '');
  await page.focus(inputServer);
  await page.type(inputServer, 'oihwice.wice-net.de');
  await page.click('.auth-container:nth-child(3) button');
  await page.click('.auth-container:nth-child(3) .btn-done');
  // await page.click('.auth-btn-wrapper:nth-child(3) button[type="submit"]');

  // // Find login route and input login credentials
  const handle = '.opblock-summary.opblock-summary-post';
  const inputCredentials = JSON.stringify(credentials);
  const apiKey = '                                      ';
  // const apiKey = keys.apiKey;
  await page.waitForSelector(handle);
  await page.click(handle);
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('.body-param__text');
  await page.focus('.body-param__text');
  await page.$eval('.body-param__text', el => el.value = '');
  await page.type('.body-param__text', inputCredentials);
  await page.click('.opblock-control__btn');

  // Get the cookie from response
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  const { cookie } = jsonResponse;
  expect(response).toContain('cookie');
  expect(cookie).toBeTruthy();
  expect(cookie.length).not.toEqual(0);

  // Open 'Authorize' popup
  await page.click('.schemes .auth-wrapper .authorize');
  await page.waitForSelector('.modal-ux-content input');

  // Input API-KEY
  const inputApi = '.modal-ux-content input';
  await page.$eval(inputApi, el => el.value = '');
  await page.focus(inputApi);
  await page.type(inputApi, apiKey);
  await page.click('.modal-ux-content button[type="submit"]');

  // Input cookie
  // await page.waitForSelector('.modal-ux-content:nth-child(2) input');
  const inputCookie = '.modal-ux-content .auth-container:nth-child(2) input';
  await page.$eval(inputCookie, el => el.value = '');
  await page.focus(inputCookie);
  await page.type(inputCookie, cookie);
  // await page.waitForSelector('.modal-ux-content:nth-child(2) button[type="submit"]');
  await page.click('.modal-ux-content:nth-child(2) button[type="submit"]');
  await page.click('.modal-ux-content .btn-done');
  await page.click('.opblock-summary-path');
  done();
}, 10000);

test('get all organizations', async (done) => {
  // Find the route for getting persons
  const handle = '#operations-organization-get_api_v1_organizations';
  await page.waitForSelector(handle);
  await page.click(handle);
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.click('.execute');
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  expect(jsonResponse).toBeInstanceOf(Array);

  // Check the last organization
  const last = jsonResponse.length - 1;

  // Check for a specific organization
  expect(jsonResponse[last].rowid).toBe(368085);
  expect(jsonResponse[last].name).toBe('Test 3');
  expect(jsonResponse[last].email).toBe('test3@email.com');

  // Close the toggle
  await page.waitForSelector('a[href="#/organization/get_api_v1_organizations"]');
  await page.click('a[href="#/organization/get_api_v1_organizations"]');
  done();
}, 10000);

test('get a single organization by a rowid', async (done) => {
  // Find the route for getting a single person
  const route = '#operations-organization-get_api_v1_organizations__rowid_';
  const handle = 'tr[data-param-name="rowid"] input';
  await page.waitForSelector(route);
  await page.click(route);
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('tr[data-param-name="rowid"] input');
  await page.focus(handle);
  await page.$eval(handle, el => el.value = '');
  await page.type(handle, '368085');
  await page.click('.execute');
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');

  // Check if the reposne is an object
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  expect(jsonResponse).toBeInstanceOf(Object);

  // // Check property values for the specific organization
  expect(jsonResponse.rowid).toBe(368085);
  expect(jsonResponse.name).toBe('Test 3');
  expect(jsonResponse.email).toBe('test3@email.com');

  // Close the toggle
  await page.waitForSelector('a[href="#/organization/get_api_v1_organizations__rowid_"]');
  await page.click('a[href="#/organization/get_api_v1_organizations__rowid_"]');
  done();
}, 10000);

test('create an organization', async (done) => {
// Find the route for getting a single organization
  // const handle = 'tr[data-param-name="rowid"] input';
  const organization = '{"name": "Your Company Ltd.", "email": "info@yourcompany.com"}';
  const route = '#operations-organization-post_api_v1_organizations';
  await page.waitForSelector(route);
  await page.click(route);
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('.body-param__text');
  await page.focus('.body-param__text');
  await page.$eval('.body-param__text', el => el.value = '');
  await page.type('.body-param__text', organization);
  await page.click('.opblock-control__btn');

  // Get the response
  const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  expect(jsonResponse.organization.rowid).not.toBe('');
  expect(jsonResponse.organization.for_rowid).not.toBe('');
  expect(jsonResponse.status).toBe('updated');
  expect(jsonResponse.msg).toBe('Organization already exists!');

  // Close the toggle
  await page.waitForSelector('#operations-organization-post_api_v1_organizations > .opblock-summary-post');
  await page.click('#operations-organization-post_api_v1_organizations > .opblock-summary-post');
  done();
}, 10000);
//
// test('update single organization', async (done) => {
//   // Find the route for updating a person
//   const person = '{"name": "Monica"}';
//   const route = '#operations-person-put_api_v1_persons__rowid_';
//   const handle = 'tr[data-param-name="rowid"] input';
//   await page.waitForSelector(route);
//   await page.click(route);
//   await page.waitForSelector('.try-out__btn');
//   await page.click('.try-out__btn');
//   await page.waitForSelector('tr[data-param-name="rowid"] input');
//   await page.focus(handle);
//   await page.$eval(handle, el => el.value = '');
//   await page.type(handle, '414426');
//   await page.focus('.body-param__text');
//   await page.$eval('.body-param__text', el => el.value = '');
//   await page.type('.body-param__text', person);
//   await page.click('.execute');
//   const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
//
//   // Check if the reposne is an object
//   const response = await page.evaluate(el => el.textContent, element);
//   const jsonResponse = JSON.parse(response);
//   expect(jsonResponse).toBeInstanceOf(Object);
//
//   //  Check property values for the specific person
//   expect(jsonResponse.rowid).toBe('414426');
//   expect(jsonResponse.status).toBe('updated');
//
//   // Close the toggle
//   await page.waitForSelector('#operations-person-put_api_v1_persons__rowid_ > .opblock-summary-put');
//   await page.click('#operations-person-put_api_v1_persons__rowid_ > .opblock-summary-put');
//   done();
// }, 10000);
//
// test('delete single person by', async (done) => {
//   // Find the route for deleting a person
//   const route = '#operations-person-delete_api_v1_persons__rowid_';
//   const handle = 'tr[data-param-name="rowid"] input';
//   await page.waitForSelector(route);
//   await page.click(route);
//   await page.waitForSelector('.try-out__btn');
//   await page.click('.try-out__btn');
//   await page.waitForSelector('tr[data-param-name="rowid"] input');
//   await page.focus(handle);
//   await page.$eval(handle, el => el.value = '');
//   await page.type(handle, '414426');
//
//   await page.click('.execute');
//   const element = await page.waitForSelector('.responses-inner div div .response .response-col_description pre');
//
//   // Check if the reposne is an object
//   const response = await page.evaluate(el => el.textContent, element);
//   const jsonResponse = JSON.parse(response);
//   expect(jsonResponse).toBeInstanceOf(Object);
//
//   //  Check property values for the specific person
//   expect(jsonResponse.rowid).toBe('414426');
//   expect(jsonResponse.status).toBe('deactivated');
//
//   // Close the toggle
//   await page.waitForSelector('#operations-person-delete_api_v1_persons__rowid_ > .opblock-summary-delete');
//   await page.click('#operations-person-delete_api_v1_persons__rowid_ > .opblock-summary-delete');
//   done();
// }, 10000);
