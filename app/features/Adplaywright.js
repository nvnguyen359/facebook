const { CRUDKNEX } = require("./crudKnex");
const { chromium, devices } = require("playwright");
const { autoScroll, delay, getFiles } = require("../shares/lib");
const shortUrl = require("node-url-shortener");
const crudKnex = new CRUDKNEX();
const lib = require("./../shares/lib");
const knex = require("knex");
/**
 * url
 * headless
 */
class CrawData {
  //#region setup
  _url = "https://www.facebook.com/";
  _headless;
  _browser;
  _page;
  _context;
  _uid;
  _socialId;
  _cookies;
  _devices;
  _updateSocial;
  constructor(headless = true, url = "") {
    this._headless = headless;
    if (url != "") this._url = url;
  }
  /**
   * @param {any} url
   */
  set Url(url) {
    this._url = url;
  }
  get Url() {
    return this._url;
  }
  set UpdateSocial(flag) {
    this._updateSocial = flag;
  }
  get UpdateSocial() {
    // if (!this._updateSocial) this._updateSocial = true;
    return this._updateSocial;
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

  async setup(isIphone = false) {
    const iphone13 = devices["iPhone 13"];
    this._browser = await chromium.launch({
      headless: this._headless,
    });
    // Create a new Playwright context to isolate browsing session
    const context = isIphone
      ? await this._browser.newContext({ ...iphone13 })
      : !this.devicesName
      ? await this._browser.newContext()
      : await this._browser.newContext({ ...devices[this.devicesName] });
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
  async getAvatar() {
    const page = this._page;
    const url = await page.evaluate(async () => {
      let result = "";
      try {
        result = document.querySelector("image").getAttribute("xlink:href");
      } catch (error) {
        result = document
          .querySelector('[aria-label="Hành động với ảnh đại diện"]')
          .querySelector("image")
          .getAttribute("xlink:href");
      }
      return result;
    });
  
    return url;
  }
  async getNumberGroup() {
    const page = this._page;
    return await page.evaluate(async () => {
      return document
        .querySelectorAll("h2>span")[2]
        .textContent.replace(/[^0-9]/g, "");
    });
  }
  async getInfoSocial(page, social) {
    await page.goto(`${this._url}${social.uid}`);
    try {
      await page.waitForSelector("span>h1");
      social.name = await page.$eval("span>h1", (node) => node.textContent);
      social.avatar = await lib.downloadFile(await this.getAvatar());
      console.log(social)
    } catch (error) {}
    let cookies = await this.getCookies();
    social.cookies = JSON.stringify(cookies);
    social.uid = Array.from(cookies).find((x) => x["name"] == "c_user").value;
    return social;
  }
  //#endregion
  async loginDesktop(social, isUpdate = false) {
    if (social?.no) delete social.no;
    if (!social.numberLogin) social.numberLogin = 0;
    //console.log(social)
    crudKnex.setTable = "social";
    try {
      await this.setup();
    } catch (error) {
      console.log(error);
    }

    const page = this._page;
    this._socialId = social.id;
    const updatedAt = new Date(social.updatedAt);
    const today = new Date();
    if (social.cookies && updatedAt.subDays() < 10) {
      await this.setCookies(JSON.parse(social.cookies));
      await page.waitForTimeout(800);
      await page.goto(this._url);
      await page.waitForURL(this._url);
      await page.waitForTimeout(2000);
      const getIdEmail = await page.$("#email"); //await page.locator('#email');
      //console.log(getIdEmail)
      if (getIdEmail) {
        await page.locator("#email").focus();
        await page.keyboard.type(social.userName, { delay: 100 });
        await page.locator("#pass").focus();
        await page.keyboard.type(social.password, { delay: 210 });
        await page.getByTestId("royal_login_button").click();
        await page.waitForTimeout(2000);
      }
      if (isUpdate) {
        social = await this.getInfoSocial(page, social);
        await crudKnex.update(social);
      }
    } else {
      await page.getByPlaceholder("Email address or phone number").focus();
      await page.keyboard.type(social.userName, { delay: 200 });
      await this._page.waitForTimeout(1000);
      await page.getByPlaceholder("Password").focus();
      await page.keyboard.type(social.password, { delay: 200 });
      await this._page.waitForTimeout(1000);
      await page.getByTestId("royal_login_button").click();
      await page.waitForTimeout(1000);

      console.log("click vao trang chu");
      await page.click(`a[href*="${this._url}"]`);
      await page.waitForURL(`${this._url}**`);
      await page.waitForTimeout(3000);
      social = await this.getInfoSocial(page, social);

      // social.active = 1;
      this._uid = social.uid;
      await crudKnex.update(social);
      console.log("update");
    }
  }
  async loginMobile(social) {
    this._url = "https://m.facebook.com/";
    await this.setup(true);
    const page = this._page;
    if (!social.numberLogin) social.numberLogin = 0;
    if (social.cookies && social.numberLogin < 4) {
      await this.setCookies(social.cookies);
      await page.waitForTimeout(800);
      await page.goto(this._url);
      await page.waitForTimeout(2000);
      social.numberLogin++;
    } else {
      social.numberLogin = 0;
      // console.log(this._url)
      await page.goto(this._url);
      await page.locator("#m_login_email").focus();
      await page.keyboard.type(social.userName, { delay: 200 });
      await page.waitForTimeout(1000);
      //  await page.getByLabel("Password").nth(0).focus();
      await page.locator("#m_login_password").focus();
      await page.keyboard.type(social.password, { delay: 200 });
      await page.waitForTimeout(1000);
      if (await page.$('[aria-label="Đăng nhập"]')) {
        await page.getByLabel("Đăng nhập").click();
      } else {
        await page.getByLabel("Log in").click();
      }

      await page.waitForTimeout(3000);
      //  await page.reload({ waitUntil: "load" });
      // await page.waitForTimeout(2000);
      try {
        await page.locator('[aria-label="Lúc khác"]').click();
      } catch (error) {}
      // if (await page.$('[aria-label="Lúc khác"]')) {
      //  //
      //  await page.goto(this._url);
      // }
      // const text = await page.getByText("Incorrect password");
      // console.log("text", text);
      await page.waitForURL(`${this._url}**`);
      try {
        await page.locator('[aria-label="Go to profile"]').click();
        await page.waitForURL(`${this._url}**`);
        await delay(3000);
        social.name = await page.$eval(
          '[role="heading"]',
          (node) => node.textContent
        );
      } catch (error) {}

      const linkAvater = await page.$eval(
        '[aria-label="Edit profile photo"]> [role="img"]> img',
        (node) => node.src
      );
      social.avatar = linkAvater;
      let cookies = await this.getCookies();
      social.cookies = JSON.stringify(cookies);
      social.uid = Array.from(cookies).find((x) => x["name"] == "c_user").value;
      social.active = 1;
      this._uid = social.uid;
      social.numberLogin = social.numberLogin + 1;
      crudKnex.setTable = "social";
      crudKnex.update(social);
    }
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
  async isLangugeEn(page) {
    page = !this._page ? page : this._page;
    return await page.evaluate(() => {
      return document.querySelector("html").getAttribute("lang") == "en";
    });
  }
  //=====================

  async getGroupsDesktop(social) {
    // console.log(social)
    await this.loginDesktop(social);
    crudKnex.setTable = "groupFb";
    const url = "https://www.facebook.com/groups/joins/?nav_source=tab";
    const page = this._page;
    if (social?.cookies) {
      await this.setCookies(social.cookies);
    }
    await page.goto(url, {});

    await page.setDefaultNavigationTimeout(0);
    await page.waitForURL(url);
    // Wait for 1 second to ensure page content loads properly
    await page.waitForTimeout(4000);
    // const numberGroup = await this.getNumberGroup();
    let auto = true;
    let count = 0;
    this._uid = social.uid;
    this._socialId = social.id;
    let flag = "";
    while (auto) {
      await autoScroll(page, 3);
      await delay(3000);
      const divs = await this.getInfoGroupsDesktop(social);
      let divFlast = Array.from(divs);

      const flast = divFlast[divFlast.length - 1];
      Array.from(divs).forEach(async (item, index) => {
        item.avatar = await lib.downloadFile( item.avatar );
        let group = await crudKnex.findOne({ groupId: item.groupId });
        if (group) {
          group.name = item.name;
          group.avatar = item.avatar;
          await crudKnex.update(group);
        } else {
          await crudKnex.create(item);
        }
        await delay(100);
      });

      if (flast.groupId != flag) {
        flag = flast.groupId;
        count = 0;
      } else {
        count++;
      }
      console.log("Đếm:", count);
      if (count == 200) auto = false;
    }
    console.log("da lay danh sach xong");
    await this.close();
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
  async getFriends(page) {
    return new Promise(async (res, rej) => {
      await page.evaluate(() => {
        const friends = document.querySelector(
          'span>a[role="link"][href*="friend"]'
        ).textContent;
        res(friends);
      });
    });
  }
  async shortLink(result) {
    return new Promise((res, rej) => {
      shortUrl.short(result, (err, url) => {
        res(url);
      });
    });
  }
  async getInfoGroupsDesktop(social) {
    const page = this._page;
    return await page.evaluate(async (social) => {
      const urlGruop = "https://www.facebook.com/groups/";
      let items = document.querySelectorAll('[role="list"]');
      let chItems =
        items[items.length - 1].querySelectorAll('[role="listitem"]');
      let array = [];
      chItems.forEach(async (item) => {
        const its = item.querySelectorAll(`a[href*="${urlGruop}"]`);
        const avatart = its[0]
          .querySelector("image")
          .getAttribute("xlink:href")
          .trim();
        if (its.length > 0) {
          array.push({
            avatar: await lib.downloadFile(avatart),
            groupId: its[0]
              .getAttribute("href")
              .replace(urlGruop, "")
              .replace("/", "")
              .trim(),
            name: its[1].textContent,
            socialId: social.id,
            uid: social.uid,
            active: 1,
            createdAt: new Date(),
          });
        }
      });
      return array;
    }, social);
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
  //#endregion newfeed mobile
  async newFeedMobile(social, article) {
    let content = article.content;
    const linkProducts = article?.linkProducts;
    if (linkProducts) content += "link :" + linkProducts;

    await this.loginMobile(social);
    const url = "https://m.facebook.com/composer/"; //document.querySelector('[aria-label="Tạo bài viết trên Facebook"]').click()//aria-label="Make a Post on Facebook"
    const page = this._page;
    await page.goto(url);
    await delay(1000);

    const folderMedia = article?.media;
    if (folderMedia) {
      const formatVideo = ["mp4", "mov", "avi", "mkv", "wmv"];
      const files = getFiles(folderMedia);

      let fileVideos = files.filter((pathFile) => {
        const t = pathFile.split(".");
        if (formatVideo.includes(t[t.length - 1])) {
          return pathFile;
        }
      });
      let filePhotos = files.filter((pathFile) => {
        const t = pathFile.split(".");
        if (!formatVideo.includes(t[t.length - 1])) {
          return pathFile;
        }
      });
      const random = Math.floor(Math.random() * 1) + 0;
      if (fileVideos.length > 0 && filePhotos.length > 0) {
        switch (random) {
          case 0:
            await this.uploadVideo(fileVideos, page);
            break;

          default:
            await this.uploadPhotos(filePhotos, page);
            break;
        }
      }
      if (fileVideos.length > 0 && !filePhotos) {
        await this.uploadVideo(fileVideos, page);
      }
      if (!fileVideos.length && filePhotos.length > 0) {
        await this.uploadPhotos(filePhotos, page);
      }
      await page.waitForTimeout(2000);
      const boxContent =
        (await page.$('[aria-label="Bạn đang nghĩ gì?"]')) ||
        (await page.$(`[aria-label="What's on your mind?"]`));
      if (boxContent) boxContent.focus();
      await page.keyboard.type(content, { delay: 100 });
      await page.waitForTimeout(3000);
      //await delay(4000);
      await page.evaluate(() => {
        document.querySelector('[role="button"][aria-label="ĐĂNG"').click();
      });
    }

    //2 document.querySelector('[aria-label="Post a status update"]')
    //3 anh
    //4 post aria-label="POST"
  }
  async uploadVideo(fileVideos, page) {
    const el =
      '#screen-root [data-type="container"]:nth-child(7) [role="button"]:nth-child(2)';
    if (fileVideos.length > 0) {
      const numberRandomVideo =
        Math.floor(Math.random() * fileVideos.length) + 0; //accept="video/*"
      // Select one file
      console.log("file: ", fileVideos[numberRandomVideo]);
      const files = [fileVideos[numberRandomVideo]];
      await this.uploadFiles(el, files, page);
    }
  }
  async uploadPhotos(filePhotos, page) {
    // document.querySelector('#screen-root [data-type="container"]:nth-child(7) [role="button"]:nth-child(2)')
    const el =
      '#screen-root [data-type="container"]:nth-child(7) [role="button"]:nth-child(3)';
    const numberRandom = Math.floor(Math.random() * filePhotos.length) + 0; //accept="video/*"
    let fileps = [];
    for (let i = 0; i < numberRandom; i++) {
      const num = Math.floor(Math.random() * numberRandom);
      fileps.push(filePhotos[num]);
    }
    console.log("files: ", fileps);
    await this.uploadFiles(el, fileps, page);
  }
  //#endregion
  async uploadFiles(el, pathFiles, page) {
    try {
      const fileChooserPromise = page.waitForEvent("filechooser");
      await page.locator(el).click();
      const fileChooser = await fileChooserPromise;
      await fileChooser.setFiles(pathFiles);
    } catch (error) {
      await page.locator('[type="file"]').setInputFiles(pathFiles);
    }
  }
  async randomUploads(files) {
    let random = Math.floor(Math.random() * files.length) + 0;
    let fileUploads = [];
    let i = 0;
    while (i <= random) {
      const r = Math.floor(Math.random() * files.length);
      fileUploads.push(files[r]);
      i++;
    }
    return [...new Set(fileUploads)];
  }
  async newfeedDesktop(social, article) {
    this.UpdateSocial = false;
    await this.loginDesktop(social);
    const page = this._page;
    await page.goto(`https://www.facebook.com/${social.uid}`);
    await delay(3000);
    console.log("bat dau : click ban dang nghi gi");
    await page.evaluate(() => {
      document
        .querySelector(
          '[data-pagelet="ProfileComposer"] [role="button"] div span'
        )
        .click();
    }); // bạn đang nghĩ gì
    // await page.getByText("Bạn đang nghĩ gì?").click();
    // await page
    //   .locator('[data-pagelet="ProfileComposer"] [role="button"] div span')
    //   .click();
    const folderMedia = article?.media;
    if (folderMedia) {
      const files = getFiles(folderMedia);
      const filesUpload = await this.randomUploads(files);
      console.log("upload file");
      const tect = "Thêm ảnh/video";
      try {
        //  await page.getByText(tect).click();
        await delay(2000);
        await this.uploadFiles('[aria-label="Ảnh/video"]', filesUpload, page);
        console.log("xong");
      } catch (error) {}
      await page.getByText("Tiếp").click();
      await delay(2000);
      await page.getByText("Đăng").click();
    }
    //await this.close();
  }
  async isGroupDiscuss(page, folderMedia, content) {
    if (await this.isLangugeEn()) {
      await page.getByText("Write something...").click();
      await delay(1000);
      if (folderMedia) {
        const files = getFiles(folderMedia);
        const filesUpload = await this.randomUploads(files);
        await this.uploadFiles('[aria-label="Photo/video"]', filesUpload);
        const tect = "Add Photos/Videos";
        try {
          await page.getByText(tect).click();
        } catch (error) {}
      }
      await page.locator('[aria-label="Create a public post…"]').focus();
      await page.keyboard.type(content, { delay: 50 });
      await page.evaluate(() => {
        document.querySelector('[aria-label="Post"]');
      });
    } else {
      await page.getByText("Bạn viết gì đi...").click();
      await delay(1000);
      if (folderMedia) {
        const files = getFiles(folderMedia);
        const filesUpload = await this.randomUploads(files);
        await this.uploadFiles('[aria-label="Ảnh/video"]', filesUpload);
        const tect = "Thêm ảnh/video";
        try {
          await page.getByText(tect).click();
        } catch (error) {}
      }
      await page.locator('[aria-label="Tạo bài viết công khai..."]').focus();
      await page.keyboard.type(content, { delay: 50 });
      await page.evaluate(() => {
        document.querySelector('[aria-label="Đăng"]');
      });
    }
  }
  async sellSomething(page) {}
  async postGroup(article, idGroup) {
    let content = article.content;
    const linkProducts = article?.linkProducts;
    if (linkProducts)
      content +=
        "link :" +
        `${linkProducts}`.split(",").map(async (x) => {
          return await this.shortLink(x);
        });
    const folderMedia = article?.media;
    let url = `${this.Url}/${idGroup}`;
    const page = this._page;
    await page.goto(url);
    if (this.isLangugeEn()) {
      if (page.$("text='Sell ​​something'")) {
      }
    } else {
      if (page.$("text='Bán gì đó'")) {
        await this.sellSomething(page);
      } else {
        await this.isGroupDiscuss(page, folderMedia, content);
      }
    }
  }
}
module.exports = { CrawData };
