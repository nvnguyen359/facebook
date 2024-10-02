const { delay } = require("lodash");
const { chromium } = require("playwright");
const { autoScroll } = require("../shares/lib");
/**
 * url
 * headless
 */
class CrawData {
  _url;
  _headless;
  _browser;
  _page;
  constructor(url = "", headless = true) {
    this._headless = headless;
    this._url = url;
  }
  /**
   * @param {any} url
   */
  set setUrl(url) {
    this._url = url;
  }
  /**
   * @param {boolean} headless
   */
  set setHeadless(headless) {
    this._headless = headless;
  }
  async setup() {
    this._browser = await chromium.launch({
      headless: this._headless,
    });
    // Create a new Playwright context to isolate browsing session
    const context = await this._browser.newContext();
    // Open a new page/tab within the context
    this._page = await context.newPage();

    // Navigate to the GitHub topics homepage
    await this._page.goto(this._url);
    // Wait for 1 second to ensure page content loads properly
    await this._page.waitForTimeout(1000);
  }
  async close() {
    // Close the browser instance after task completion
    await this._browser.close();
  }
  async loginFaceBook(userName, password) {
    const page = this._page;
    await page.getByPlaceholder("Email address or phone number").focus();
    await page.keyboard.type(userName, { delay: 200 });
    await this._page.waitForTimeout(1000);
    await page.getByPlaceholder("Password").focus();
    await page.keyboard.type(password, { delay: 200 });
    await this._page.waitForTimeout(1000);
    await page.getByTestId("royal_login_button").click();
  }
  async getGroups() {
    const page = this._page;
    //https://www.facebook.com/groups/feed/
    await this._page.waitForTimeout(10000);
    // await page.getByRole('link', { name: 'Nhóm' }).click();
    await this._page
      .locator('[href="https://www.facebook.com/groups/?ref=bookmarks"]')
      .click();
    const time = Math.floor(Math.random() * 10000) + 4000;
    await this._page.waitForTimeout(time);
    //await page.mouse.wheel();
    // await page.waitForTimeout(50000);
    await page.mouse.click(10, 100);
    await page.locator('a[href="/groups/joins/?nav_source=tab"]').click();
    await this._page.waitForTimeout(5000);
    await autoScroll(page, 400);
    // let groups = await page.locator('a[aria-label="Xem nhóm"]');
    // console.log(groups.length, groups[0]);
    const dt = await page.$$eval('a[aria-label="Xem nhóm"]', (nodes) =>
      nodes.map((n) => n.getAttribute('href'))
    );
    console.log('count:',dt.length,dt[0]);
  }
  async addCookies() {
    await this._browser.addCookies([cookieObject1, cookieObject2]);
  }
  async geCookies() {
    return await this._browser.Contexts[0].CookiesAsync();
  }
  async autoScroll(interval = 1) {
    const page = this._page;
    setInterval(
      async () => {
        await page.evaluate(() =>
          window.scrollTo(0, document.body.scrollHeight)
        );
      },
      page,
      interval * 1000
    );
  }
}
module.exports = { CrawData };
