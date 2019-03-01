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
