const { CRUD } = require("../features/crud");
(async () => {
  console.time()
  const crud = new CRUD("order");
 await crud.loadInfo()
 //await crud.initLoad("order");
 console.log((await crud.getAll()).length);
 console.timeEnd()
})();
