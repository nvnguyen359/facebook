
const { CRUDKNEX } = require("./crudKnex");
const { chromium, devices } = require("playwright");
const { autoScroll, delay, getFiles } = require("../shares/lib");
const shortUrl = require("node-url-shortener");
const crudKnex = new CRUDKNEX();
class FaceBook{
    _url = "https://www.facebook.com/";
    _headless;
    _browser;
    _page;
    _context;
    _uid;
    _socialId;
    _cookies;
    _devices;
    constructor(headless = true, url = "") {
      this._headless = headless;
      if (url != "") this._url = url;
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
    set Cookies(cookies) {
      this._cookies = cookies;
    }
    get Cookies() {
      return this._cookies;
    }
    set devicesName(dv) {
      this._devices = dv;
    }
    get devicesName() {
      return this._devices;
    }
  
    async setup() {
      this._browser = await chromium.launch({
        headless: this._headless,
      });
      // Create a new Playwright context to isolate browsing session
      const context = !this.devicesName
      ? await this._browser.newContext()
      : await this._browser.newContext({ ...devices[this.devicesName] });
      // Open a new page/tab within the context
      this._page = await context.newPage({
        viewport: {
            width: 540,
            height: 800,
          },
          deviceScaleFactor: 2,
      });
      this._context = context;
      // Navigate to the GitHub topics homepage
      await this._page.goto(this._url);
      // Wait for 1 second to ensure page content loads properly
      await this._page.waitForTimeout(1000);
    }
    async close() {
      // Close the browser instance after task completion
      await this._browser.close();
    }
    async setCookies(cookies) {
      if (!Array.isArray(cookies)) cookies = JSON.parse(cookies);
      const context = this._context;
      await context.addCookies(cookies);
    }
    async getCookies() {
      const context = this._context;
      const cookies = await context.cookies();
      return cookies;
    }
}