const { CRUDKNEX } = require("./crudKnex");
const { chromium, devices } = require("playwright");
const { autoScroll, delay } = require("../shares/lib");
const knex = require("knex");
const crudKnex = new CRUDKNEX();
/**
 * url
 * headless
 */
class CrawData {
  _url = "https://www.facebook.com/";
  _headless;
  _browser;
  _page;
  _context;
  _uid;
  _socialId;
  constructor( headless = true,url = "") {
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
  async setup(isIphone = false) {
    const iphone13 = devices["iPhone 13"];
    this._browser = await chromium.launch({
      headless: this._headless,
    });
    // Create a new Playwright context to isolate browsing session
    const context = isIphone
      ? await this._browser.newContext({ ...iphone13 })
      : await this._browser.newContext();
    // Open a new page/tab within the context
    this._page = await context.newPage();
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
  async loginDesktop(social) {
    let {
      userName,
      password,
      id,
      uid,
      status,
      name,
      avatar,
      cookies,
      createdAt,
    } = social;
    const page = this._page;
    if (uid) this._uid = uid;
    this._socialId = id;
    const expires = new Date(createdAt).addDays(200);
    const today = new Date();
    if (cookies && today.getTime() != expires.getTime()) {
      await this.setCookies(cookies);
    } else {
      await page.getByPlaceholder("Email address or phone number").focus();
      await page.keyboard.type(userName, { delay: 200 });
      await this._page.waitForTimeout(1000);
      await page.getByPlaceholder("Password").focus();
      await page.keyboard.type(password, { delay: 200 });
      await this._page.waitForTimeout(1000);
      await page.getByTestId("royal_login_button").click();
      await page.waitForTimeout(1000);
      // click vao trang chu
      await page.click(`a[href*="${this._url}"]`, { delay: 1000 });
      await page.waitForURL(`${this._url}**`);
      await page.waitForTimeout(2000);
      await page.waitForSelector("span > h1");
      social.name = await page.$eval("span > h1", (node) => node.textContent);
      social.avatar = await this.getAvatar();
      cookies = await this.getCookies();
      social.cookies = JSON.stringify(cookies);
      social.uid = Array.from(cookies).find((x) => x["name"] == "c_user").value;
      social.active = 1;
      this._uid = social.uid;

      crudKnex.setTable = "social";
      crudKnex.update(social);
    }

    // await this._browser.close()
  }
  async loginMobile(social) {
    const { userName, password } = social;
    const page = this._page;
    await page.getByLabel("Mobile number or email address").nth(0).focus();
    await page.keyboard.type(userName, { delay: 200 });
    await page.waitForTimeout(1000);
    await page.getByLabel("Password").nth(0).focus();
    await page.keyboard.type(password, { delay: 200 });
    await page.waitForTimeout(1000);
    await page.getByLabel("Log in").click();
    await page.waitForTimeout(4000);
    const text = await page.getByText("Incorrect password");
    console.log("text", text);
  }
  getUrlAfterRedirect() {
    return new Promise((res, rej) => {
      const page = this._page;
      page.on("response", (response) => {
        console.log("Redirected to:", response.url());
        res(response.url());
      });
    });
  }
  async getGroups() {
    const url = "https://m.facebook.com/groups/";
    const page = this._page;
    await page.goto(url);
    await page.waitForURL(url);
  }
  //=====================
  async getAvatar() {
    const page = this._page;
    return await page.evaluate(async () => {
      return document
        .querySelector('[aria-label="Hành động với ảnh đại diện"]')
        .querySelector("image")
        .getAttribute("xlink:href");
    });
  }
  async getNumberGroup() {
    const page = this._page;
    return await page.evaluate(async () => {
      return document
        .querySelectorAll("h2>span")[2]
        .textContent.replace(/[^0-9]/g, "");
    });
  }
  async getGroupsDesktop(social) {
    crudKnex.setTable = "groupFb";
    const url = "https://www.facebook.com/groups/joins/?nav_source=tab";
    const page = this._page;
    if (social?.cookies) {
      await this.setCookies(social.cookies);
    }
    await page.goto(url);
    await page.waitForURL(url);
    // Wait for 1 second to ensure page content loads properly
    await page.waitForTimeout(4000);
    const numberGroup = await this.getNumberGroup();
    let auto = true;
    let count = 0;
    while (auto) {
      await autoScroll(page, 3);
      const divs = await this.getInfoGroupsDesktop();
      Array.from(divs).forEach(async (item, index) => {
        let group = await crudKnex.findOne({ groupId: item.groupId });
        if (group) {
          group.name = item.name;
          group.avatar = item.avatar;
          await crudKnex.update(group);
        } else {
          await crudKnex.create(item);
        }
      });
      count = (await crudKnex.findAll({ limit: 10000 })).count;
      await delay(2000);
      if (count == numberGroup) auto = false;
    }
  }
  async getInfoGroups() {
    const page = this._page;
    return await page.evaluate(async () => {
      const items = document
        .querySelector(
          "#screen-root > div > div:nth-child(2) > div:nth-child(6)"
        )
        .querySelectorAll('div.m.bg-s3[tabindex="0"][data-type="container"]');
      items.forEach((item) => {
        const obj = {
          image: item.querySelector("img").src,
          name: textContent,
        };
      });
    });
  }
  async getInfoGroupsDesktop() {
    const page = this._page;
    return await page.evaluate(async () => {
      const items = document
        .querySelectorAll('[role="list"]')[1]
        .querySelectorAll('[role="listitem"]');
      let array = [];
      items.forEach((item) => {
        const its = item.querySelectorAll(
          'a[href*="https://www.facebook.com/groups"]'
        );
        if (its.length > 0)
          array.push({
            id: 0,
            avatar: its[0].querySelector("image").getAttribute("xlink:href"),
            groupId: its[0].getAttribute("href").replace(/[^0-9]/g, ""),
            name: its[1].textContent,
            socialId: this._socialId,
            uid: this._uid,
            createdAt: new Date(),
          });
      });
      return array;
    });
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
