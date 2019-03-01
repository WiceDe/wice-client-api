/* eslint no-return-assign: "off" */
/* eslint no-param-reassign: "off" */

const puppeteer = require('puppeteer');

let browser;
let page;

beforeEach(async () => {
  browser = await puppeteer.launch({
    headless: false,
  });
  page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 1024 });
  await page.goto('localhost:5000');
});

afterEach(async () => {
  // await browser.close();
});

test('if the header has the correct subtitle', async () => {
  const desc = await page.$eval('.renderedMarkdown > p', el => el.innerHTML);
  expect(desc).toEqual('This is a client API for Wice CRM');
});

test('user login functionality', async () => {
  const credentials = '{"mandant_name": "sandbox", "username": "syanev", "password": "d36adb53"}';
  await page.click('.opblock-summary.opblock-summary-post');
  await page.click('.try-out__btn');
  await page.waitForSelector('.body-param__text');
  await page.focus('.body-param__text');
  await page.$eval('.body-param__text', el => el.value = '');
  await page.type('.body-param__text', credentials);
  await page.click('.opblock-control__btn');

  const element = await page.waitForSelector('.microlight');
  const response = await page.evaluate(el => el.textContent, element);
  const jsonResponse = JSON.parse(response);
  const { cookie } = jsonResponse;
  console.log(cookie);
  expect(response).toContain('cookie');
});
