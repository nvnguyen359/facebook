const { CRUDKNEX } = require("../features/crudKnex");
const { CRUD } = require("../features/crud");
const { asyncData } = require("./../apis/asyncData");
const lib = require("../shares/lib");
const apisSqlite = async (app) => {
  createDatabase(app);
  const array = await getAllTables();
  //console.log(array);
  array.forEach((element) => {
    let crud = new CRUDKNEX(element);
    findAll(element, app, crud);
    findId(element, app, crud);
    findOne(element, app, crud);
    // upsert(element, app, crud);
    create(element, app, crud);
    destroy(element, app, crud);
    bulkDelete(element, app, crud);
    bulkUpdate(element, app, crud);
  });
  getAllOrders(app);
  inventory(app);
  // let crud = new CRUDKNEX("Đơn Hàng");
  // getAll("donhang", app, crud);
  return app;
};
const createDatabase = (app) => {
  app.get(`/api/database`, async (req, res, next) => {
    asyncData();
    res.send({ result: "done" });
    next();
  });
};

const getAllOrders = (app) => {
  app.get(`/api/orders`, async (req, res, next) => {
    const q = req.query;
    const column = q.columns ? q.columns.split(",") : [];
    const limit = parseInt(q.pageSize) || parseInt(q.limit) || 100;
    const offset = parseInt(q.page) || 0;
    const startDay = q.startDay ? new Date(q.startDay).startDay() : null;
    const endDay = q.endDay ? new Date(q.endDay).endDay() : null;
    let crud = new CRUDKNEX("order");
    let obj = {
      query: q.query,
      column,
      limit,
      offset: offset * limit,
      name: q.name,
    };

    if (startDay) {
      obj.startDay = startDay;
      obj.endDay = endDay;
    }
    let listOrders = !startDay
      ? await crud.findAll(obj)
      : await crud.findAll(obj);

    let crudDetails = new CRUDKNEX("orderDetails");
    let result = [];
    for (let i = 0; i < listOrders.items.length; i++) {
      let x = listOrders.items[i];
      x.details = await crudDetails.filterWithObj({ orderId: x.id });
      result.push(x);
    }
    res.send({ count: listOrders.count, items: result });
    next();
  });
};
const calInventory = async (offset = 0, limit = 100000) => {
  let crud = new CRUDKNEX();
  let obj = {
    limit,
    offset: offset * limit,
  };

  crud.setTable = "product";
  let getproducts = await crud.findAll(obj);
  const items = getproducts.items;
  let result = [];
  for (let index = 0; index < items.length; index++) {
    const product = items[index];
    const ob = { productId: product.id };
    crud.setTable = "orderDetails";
    let getorderDetails = await crud.filterWithObj(ob);
    crud.setTable = "importGoods";
    let getimportGoods = await crud.filterWithObj(ob);

    const filterDetails = getorderDetails.filter(
      (x) => x.productId == product.id
    );
    const filterImport = getimportGoods.filter(
      (x) => x.productId == product.id
    );
    const sumImport = Array.from(
      filterImport.map((x) => parseInt(x.quantity))
    ).reduce((a, b) => a + b, 0);
    const sumOuput = Array.from(
      filterDetails.map((x) => parseInt(x.quantity))
    ).reduce((a, b) => a + b, 0);
    const sumValueImprtPrice2 = filterImport
      .map((x) => parseInt(x.quantity) * parseInt(x.importPrice))
      .reduce((a, b) => a + b, 0);
    const sumValueImprtPrice1 = filterDetails.map(
      (x) => parseInt(x.quantity) * parseInt(x.importPrice)
    );
    const sumValuePrice2 = filterImport
      .map((x) => parseInt(x.quantity) * parseInt(x.price))
      .reduce((a, b) => a + b, 0);
    const sumValuePrice1 = filterDetails
      .map((x) => parseInt(x.quantity) * parseInt(x.price))
      .reduce((a, b) => a + b, 0);
    const obj = {
      id: product.id,
      name: product.name,
      sumImport,
      sumOuput,
      inventory: sumImport - sumOuput,
      valueImport: sumValueImprtPrice2 - sumValueImprtPrice1,
      valueOut: sumValuePrice2 - sumValuePrice1,
      profit:
        -(sumValueImprtPrice2 - sumValueImprtPrice1) +
        (sumValuePrice2 - sumValuePrice1),
    };
    result.push(obj);
  }
  return { items: result, count: getproducts.count };
};
const inventory = (app) => {
  app.get(`/api/inventory`, async (req, res, next) => {
    const q = req.query;
    const limit = parseInt(q.pageSize) || parseInt(q.limit) || 100;
    const offset = parseInt(q.page) || 0;
    const result = await calInventory(offset, limit);
    res.send({ count: result.count, items: result.items });
    next();
  });
};
const upsert = (element, app, crud) => {
  app.put(`/api/${element}`, async (req, res, next) => {
    const row = req.body ? req.body : null;
    const result = await crud.upsert(row);
    res.send({ result });
    next();
    const gg = new CRUD(element);
    gg.put(row);
  });
};
const bulkUpdate = (element, app, crud) => {
  app.put(`/api/${element}`, async (req, res, next) => {
    let rows = req.body ? req.body : null;
    if (!Array.isArray(rows)) rows = [rows];
    const result = [];
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      result.push(await crud.upsert(row));
      await lib.delay(100);
    }
    res.send({ result });
    next();
    const gg = new CRUD(element);
    for (let index = 0; index < rows.length; index++) {
      const row = rows[index];
      await gg.put(row);
      await lib.delay(1000);
    }
  });
};
const create = (element, app, crud) => {
  app.post(`/api/${element}`, async (req, res, next) => {
    let row = req.body ? req.body : null;
    const result = await crud.create(row);
    res.send({ result });
    next();
    const gg = new CRUD(element);
    await gg.post(result);
  });
};

const findAll = (element, app, crud) => {
  app.get(`/api/${element}`, async (req, res, next) => {
    const q = req.query;
    console.log('findAll',q)
    const column = q.columns ? q.columns.split(",") : [];
    const limit = parseInt(q.pageSize) || parseInt(q.limit) || 100;
    const offset = parseInt(q.page) || 0;
    const startDay = q.startDay;
    const endDay = q.endDay;
    const search =q.search? JSON.parse(q.search):undefined;
    
    const obj = {
      query: q.query,
      column,
      limit,
      offset: offset * limit,
      startDay,
      endDay,
      search,
    };
    if (element == "product") {
      const getInventory = await calInventory();
      const products = (await crud.findAll(obj)).items.map((x) => {
        const findId = getInventory.items.find((y) => y.id == x.id);
        if (findId) {
          x.inventory = findId.inventory;
        }
        return x;
      });
      res.send({
        count: getInventory.count,
        items: products,
      });
    } else {
      res.send(await crud.findAll(obj));
    }

    next();
  });
};
const findId = (element, app, crud) => {
  app.get(`/api/${element}/:id`, async (req, res, next) => {
    const id = req.params.id;
    res.send(await crud.findId(id));
    next();
  });
};
const findOne = (element, app, crud) => {
  app.get(`/api/${element}/obj`, async (req, res, next) => {
    const id = req.params.id;
    const result = await crud.findId(id);
    res.send(result);
    next();
  });
};
const destroy = (element, app, crud) => {
  app.delete(`/api/${element}/:id`, async (req, res, next) => {
    const id = req.params.id;
    const result = await crud.destroy(id);
    res.send({ result });
    next();
    const gg = new CRUD(element);
    await gg.deleteId(id);
  });
};
const bulkDelete = (element, app, crud) => {
  app.delete(`/api/${element}/:ids`, async (req, res, next) => {
    const ids = req.params.ids.split(",");
    const result = await crud.bulkDelete(ids);
    res.send(result);
    next();
    const gg = new CRUD(element);
    for (let index = 0; index < ids.length; index++) {
      const id = ids[index];
      //console.log("delete gg", element, id);
      await gg.deleteId(id);
      await lib.delay(1000);
    }
  });
};
const getAllTables = async () => {
  return new Promise(async (res, rej) => {
    let crud = new CRUDKNEX();
    const tables = await crud.initTable();
    res(tables);
  });
};

module.exports = { apisSqlite, getAllTables };
