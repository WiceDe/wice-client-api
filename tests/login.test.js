/* eslint no-return-assign: "off" */
/* eslint no-param-reassign: "off" */

const puppeteer = require('puppeteer');

let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
    args: ['--disable-dev-shm-usage'],
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('localhost:5000');
});

afterEach(async () => {
  await browser.close();
});

test('if the header has the correct subtitle', async () => {
  const desc = await page.$eval('.renderedMarkdown > p', el => el.innerHTML);
  expect(desc).toEqual('This is a client API for Wice CRM');
});

test('user login functionality', async (done) => {
  // Find login route and input login credentials
  const credentials = '{"mandant_name": "sandbox","username": "shterion","password": "d36adb53"}';
  const apiKey = 'fsuogsi9p1im1gpnhvapjdtx94z46qye';
  await page.waitForSelector('.opblock-summary.opblock-summary-post');
  await page.click('.opblock-summary.opblock-summary-post');
  await page.waitForSelector('.try-out__btn');
  await page.click('.try-out__btn');
  await page.waitForSelector('.body-param__text');
  await page.focus('.body-param__text');
  await page.$eval('.body-param__text', el => el.value = '');
  await page.type('.body-param__text', credentials);
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
  await page.click('.btn.authorize');
  await page.waitForSelector('.modal-ux-content input');
  // Input API-KEY
  await page.$eval('.modal-ux-content input', el => el.value = '');
  await page.focus('.modal-ux-content input');
  await page.type('.modal-ux-content input', apiKey);
  await page.click('.modal-ux-content button[type="submit"]');

  // Input cookie
  // await page.waitForSelector('.modal-ux-content:nth-child(2) input');
  await page.$eval('.modal-ux-content:nth-child(2) input', el => el.value = '');
  await page.focus('.modal-ux-content:nth-child(2) input');
  await page.type('.modal-ux-content:nth-child(2) input', cookie);
  // await page.waitForSelector('.modal-ux-content:nth-child(2) button[type="submit"]');
  await page.click('.modal-ux-content:nth-child(2) button[type="submit"]');
  await page.click('.modal-ux-content .btn-done');
  await page.click('.opblock-summary-path');
  done();
}, 8000);
