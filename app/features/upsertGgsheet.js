// đồng bộ dữ liệu google sheet đến  sqlite
const _ = require("lodash");
const { delay, isEqualObj } = require("../shares/lib");
const { CRUDKNEX } = require("./crudKnex");
const { CRUD } = require("./crud");
const schedule = require("node-schedule");
const knex = require("knex");
const { getAllTables } = require("../apis/apiSqlite");
require("colors");
const addNewElementFromLocalToGoogleSheet = async (
  getAllGG,
  getAllTableSqlites,
  crudGg,
  crudKnex,
  tableName
) => {
  const timer = 200;
  for (let index = getAllTableSqlites.items.length - 1; index >= 0; index--) {
    let element = getAllTableSqlites.items[index];
    const id = element.id;
    const getIdGg = getAllGG.find((x) => x.id == id);
   
    if (!getIdGg) {
      ///console.log(id, !getIdGg);
      const result = await crudGg.post(element);
      console.log(
        "table: ".green,
        tableName,
        "New ID".green,
        result.data[0].id
      );
      await delay(2000);
    }
  }
};
const upsertGoogleSheetToLocal = async (
  getAllGG,
  getAllTableSqlites,
  crudGg,
  crudKnex,
  tableName
) => {
  const timer = 200;
  for (let index = 0; index < getAllGG.length; index++) {
    let element = getAllGG[index];
    const id = element.id;
    // console.log("check id", id);
    let getIdLocal = await crudKnex.findId(id);
    if (!getIdLocal) {
      delete element.id;
      const result = await crudKnex.create(element);
      console.log(
        "New table: ",
        tableName.green,
        " ID: ".green,
        `${result[0].id}`
      );
    } else {
      //  console.log("so sanh ", _.isEqual(element, getIdLocal, customizer(element, getIdLocal)));
      if (!isEqualObj(getIdLocal, element)) {
        getIdLocal = element;
        const result = await crudKnex.update(element);
        console.log(`Cap Nhat ${tableName.green}  ID:  `, `${result[0].id}`);
      }
      await delay(timer);
    }
  }
};
const isEqual2tables = async (tableName) => {
  const timer = 200;
  let crudGg = new CRUD();
  let crudKnex = new CRUDKNEX();
  crudGg.nameSheet = tableName;
  const getAllGG = await crudGg.getAll();
  crudKnex.setTable = tableName;
  const getAllTableSqlites = await crudKnex.findAll({
    limit: 100000000,
    offset: 0,
  });
  return getAllGG.length - getAllTableSqlites.items.length == 0;
};
const syncGoogeSheetsWithLocalDatabase = async () => {
  const timer = 200;
  let crudGg = new CRUD();
  let crudKnex = new CRUDKNEX();
  const array = await getAllTables();
  for (let index = 0; index < array.length; index++) {
    const tableName = array[index];
    crudGg.nameSheet = tableName;
    const getAllGG = await crudGg.getAll();
    crudKnex.setTable = tableName;
    const getAllTableSqlites = await crudKnex.findAll({
      limit: 100000000,
      offset: 0,
    });
    console.log("------------------------------");
    console.log("table: ", tableName.green);
    console.log(
      "google sheet! ",
      getAllGG.length,
      "sqlite: ",
      getAllTableSqlites.items.length
    );
    if (getAllGG.length < getAllTableSqlites.items.length) {
      await addNewElementFromLocalToGoogleSheet(
        getAllGG,
        getAllTableSqlites,
        crudGg,
        crudKnex,
        tableName
      );
      console.log(
        "addNewElementFromLocalToGoogleSheet: ",
        await isEqual2tables(tableName)
      );
    } else {
      console.log("cap nhat du lieu tu gg sheet".red);
      await upsertGoogleSheetToLocal(
        getAllGG,
        getAllTableSqlites,
        crudGg,
        crudKnex,
        tableName
      );
      console.log(
        "upsert GoogleSheet To Local: ",
        await isEqual2tables(tableName)
      );
    }
  }
  console.log("=========Success!==========".green);
};

console.log("xoa element khong co gg sheet");
const deleteElement = async () => {
  const timer = 200;
  let crudGg = new CRUD();
  let crudKnex = new CRUDKNEX();
  const array = await getAllTables();
  for (let index = 0; index < array.length; index++) {
    const tableName = array[index];
    crudGg.nameSheet = tableName;
    const getAllGG = await crudGg.getAll();
    crudKnex.setTable = tableName;
    const getAllTableSqlites = await crudKnex.findAll({
      limit: 100000000,
      offset: 0,
    });
    console.log("------------------------------");
    console.log("table: ", tableName.green);
    for (let index = 0; index < getAllTableSqlites.items.length; index++) {
      let element = getAllTableSqlites.items[index];
      const id = element.id;
      const getIdGg = getAllGG.find((x) => x.id == id);
      if (!getIdGg) {
        console.log("xoa phan tu ", id);
        // await crudKnex.destroy(id)
      }
    }
  }
};
const run = async () => {
  await syncGoogeSheetsWithLocalDatabase();
  //await deleteElement();
  return;
  const crudKnex = new CRUDKNEX();
  crudKnex.setTable = "importGoods";
  const importGoods = await crudKnex.findAll({ limit: 100000, offset: 0 });
  crudKnex.setTable = "product";
  const products = await crudKnex.findAll({ limit: 100000, offset: 0 });
  const imports = importGoods.items;
  let dem = 0;
  const timer = 5000;
  console.log("importGoods".bgMagenta);
  for (let index = 0; index < imports.length; index++) {
    const element = imports[index];
    const productFindId = products.items.find((x) => x.name == element.name);
    if (!productFindId) {
      crudKnex.setTable = "product";
      const obj = {
        importPrice: element.importPrice,
        price: element.price,
        unit: element.unit,
        name: element.name,
      };
      const req = await crudKnex.create(obj);
      crudKnex.setTable = "product";
      element.productId = req[0].id;
      await crudKnex.update(element);
    }
    const crud = new CRUD("importGoods");
    // crud.setTable = "product";
    const findId = await crud.getId(element.id);
    console.log("#### ".bgCyan, crud.nameSheetTitle, "  #### ".bgCyan);
    if (!findId.data) {
      const result = await crud.create(element);
      console.log("tao moi", result);
    } else {
      let obj = findId.data;
      obj.productId = element.id;
      const result = await crud.put(element);
      console.log("cap nhat", result);
    }
    await delay(timer);
  }
  console.log("PRODUCT".bgMagenta);

  for (let index = 0; index < products.items.length; index++) {
    const product = products.items[index];
    let importw = imports.find(
      (x) => x.productId == "" && x.name == product.name
    );
    if (importw) {
      importw.productId = product.id;
      crudKnex.setTable = "importGoods";
      await crudKnex.update(importw);
    }
    const crud = new CRUD("product");
    console.log("#### ".bgCyan, `${crud.nameSheetTitle}`.red, "  ####".bgCyan);
    const findId = await crud.getId(product.id);
    if (!findId.data) {
      console.log(product);
      await crud.create(product);
    }
    await delay(timer);
  }
};

(async () => {
  const interval = 80 * 60 * 1000;
  await run();
  setInterval(async () => {
    await run();
  }, interval);
})();
