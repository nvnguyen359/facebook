const { CrawData } = require("./../features/Adplaywright");

const runWork = async (app, url) => {
  app.put(url, async (req, res, next) => {
    const q = req.body;
    const craw = new CrawData(q.headless);
    const id = req.params.id;
    const values = q?.values ? q.values : null;
    try {
      switch (id) {
        case "social":
          {
            if (values.length > 0) {
              for (let index = 0; index < values.length; index++) {
                const element = values[index];
                await craw.loginDesktop(element);
                await craw.close();
              }
            }
          }
          break;
        case "groupFb":
          {
            console.log("groupFb");

            if (values.length > 0) {
              for (let index = 0; index < values.length; index++) {
                const element = values[index];
                await craw.getGroupsDesktop(element);
              }
              await craw.close();
            }
          }
          break;
        case "article":
          {
            console.log("article");
            const articies = values?.articies;
            const groups = values?.groups;
            const socials = values?.socials;
            // console.log(articies?.length,groups?.length)
            await craw.newfeedDesktop(socials[0], articies[0]);
          }
          break;
        default:
          break;
      }
      res.send({ mes: q });
    } catch (error) {
      console.log(error);
      res.send(error);
    }
    next();
  });
};
const apisFacebook = async (app) => {
  const url = `/api/fb/:id`;
  await runWork(app, url);
};
module.exports = { apisFacebook };
