const { CRUD } = require("../features/crud");
const { CRUDKNEX } = require("../features/crudKnex");
const lib = require("../shares/lib");
const asyncData = async () => {
  return new Promise(async (res, rej) => {
    console.time();
    const crudKnex = new CRUDKNEX();
    let listTable = await crudKnex.initTable();
    if (!listTable) return;

    for (let i = 0; i < listTable.length; i++) {
      const crud = new CRUD();
      crud.nameSheet = listTable[i];
      const arrayGgSheet = Array.from(await crud.getAll());
      const knexCrud = new CRUDKNEX(listTable[i]);
      for (let index = 0; index < arrayGgSheet.length; index++) {
        const element = arrayGgSheet[index];
        const findId = await knexCrud.findId(element.id);
        if (!findId) {
          await knexCrud.create(element);
        }else{
          await knexCrud.update(element);
        }
        await lib.delay(5000)
      }
      console.log(`===${listTable[i]}===`, "done!");
     
    }
    console.log('dong bo tu gg sheet')

    console.timeEnd();
    res("done");
  });
};

module.exports = { asyncData };
