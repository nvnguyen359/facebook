const path = require("path");
require("dotenv").config();
const lib = require("./../shares/lib");
const { initTable } = require("./createTable");
const { count } = require("console");
class CRUDKNEX {
  knex;
  constructor(table = null) {
    this.table = table;
    const localDatabase =
      process.env.EVN_NODE != "production"
        ? path.join(__dirname, process.env.SQLITE_FILENAME)
        : path.join(
            process.env.localDatabase + "\\Local Storage",
            process.env.SQLITE_FILENAME
          );
    this.knex = require("knex")({
      client: "sqlite",
      connection: {
        filename: `${localDatabase}.db`,
      },
      useNullAsDefault: true,
    });
  }
  async initTable() {
    return await initTable(this.knex);
  }
  set setTable(table) {
    this.table = table;
  }
  get getTable() {
    return this.table;
  }
  async create(data) {
    if (!Array.isArray(data)) {
      data = [data];
    }
    if (data.lenght < 1) return { result: [] };
    let data1 = Array.from(data).map((x) => {
      if (!x.createdAt) x.createdAt = new Date().toISOString();
      if (!x.updatedAt) x.updatedAt = new Date().toISOString();
      return x;
    });
    try {
      const result = await this.knex(this.table).insert(data1).returning("*");
      return result;
    } catch (error) {
      console.log(error);
      return { error };
    }
  }
  async update(data) {
    const id = data?.id;
    data.updatedAt = new Date().toISOString();
    try {
      const result = await this.knex(this.table)
        .where({ id })
        .update(data)
        .returning("*");
      return result;
    } catch (error) {
      return { error };
    }
  }
  async upsert(data) {
    let id = null;
    if (Array.isArray(data)) {
      id = Array.from(data)[0];
    } else {
      id = data.id;
    }
    return id ? await this.update(data) : await this.create(data);
  }
  async destroy(id) {
    const result = await this.knex(this.table)
      .del()
      .where({ id })
      .returning("*");
    // console.log("id ", id, this.table, result);
    return result;
  }
  async bulkDelete(ids) {
    return new Promise(async (res, rej) => {
      const result = await this.knex(this.table)
        .del()
        .whereIn("id", ids)
        .returning("*");
      res(result);
    });
  }
  async countCondition(obj = {}) {}
  async findAll(obj = {}) {
    let sqlClone;
    // console.log(obj)
    const {
      limit = 100,
      offset = 0,
      startDay,
      endDay,
      query,
      column,
      search,
    } = obj;

    const dateAt = "createdAt";
    const orderBy = "id";
    let result;

    if (query) {
      if (offset) {
        query += ` limit ${limit} offset ${offset} ORDER BY ${orderBy} DESC`;
      }
      result = await knex.raw(query);
    } else {

      result = this.knex(this.table).select();
      if (column) {
        result = result.column(column);
      }

      if (search && Object.keys(search)) {
        const entries = Object.entries(search);
        for (let i = 0; i < entries.length; i++) {
          const x = entries[i];
          if (i == 0) {
            result = result.where(x[0], "LIKE", `%${x[1]}`);
          } else {
            result = result.orWhere(x[0], "LIKE", `%${x[1]}`);
          }
        }
      }
      if (startDay) {
        const from = new Date(startDay).startDay().toISOString();
        result = result.where(dateAt, ">=", from);
      }
      if (endDay) {
        const to = new Date(endDay).endDay().toISOString();
        result = result.where(dateAt, "<=", to);
      }
      sqlClone = result.clone();
      result = result.limit(limit).offset(offset).orderBy(orderBy, "desc");
      console.log('count:'.green,(await sqlClone.count('id as CNT'))[0]['CNT'] ,'query:'.red,result.toString().cyan);
    }

    return new Promise(async (res, rej) => {
      //console.log(wherename)
      sqlClone.count("id as CNT").then(async (total) => {
        res({ items: await result, count: total[0].CNT });
      });
    });
  }
  async findId(id) {
    return await this.knex(this.table).where({ id }).first();
  }
  async filterWithObj(obj) {
    return await this.knex(this.table).where(obj);
  }
  async findOne(obj) {
    return await this.knex(this.table).where(obj).first();
  }
  async filterQuery(query) {
    const result = await this.knex.raw(query);
    //console.log(result)
    return result;
  }
}
// (async()=>{
//   let crud = new CRUDKNEX('Đơn Hàng');
//   await crud.getAll()
// })()
module.exports = { CRUDKNEX };
