const e = require("express");
const { delay } = require("./../shares/lib");
const knex = require("knex");
const createUsers = async (knex) => {
  try {
    const tbl = "user";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("userName", 250).notNullable();
      table.string("password", 250).notNullable();
      table.string("level", 250).notNullable();
      table.string("status", 250);
      table.string("active");
      table.string("companyId");
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};

const createWeighStation = async (knex) => {
  try {
    const tbl = "weighStation";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      // console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("productName", 250);
      table.string("carNumber", 250).notNullable();
      table.integer("weight1").notNullable();
      table.integer("weight2");
      table.integer("cargoVolume");
      table.string("ieGoods");
      table.string("tare");
      table.double("tareKg");
      table.integer("actualVolume");
      table.integer("price");
      table.double("pay");
      table.integer("exchangeRate");
      table.string("unit");
      table.double("payment"); // thanh toán sau quy đổi
      table.string("containerNumber");
      table.string("customerName");
      table.string("note");
      table.string("warehouse"); // kho
      table.string("placeOfIssue");
      table.string("recipient");
      table.string("driver");
      table.string("userId");
      table.string("customerId");
      table.string("driverId");
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createCustomer = async (knex) => {
  try {
    const tbl = "customer";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      // console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("name", 250);
      table.string("phone");
      table.string("address");
      table.string("email");
      table.string("userId");
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const createCompany = async (knex) => {
  try {
    const tbl = "company";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("name", 250);
      table.string("address");
      table.string("phone");
      table.string("fax");
      table.string("userId");
      baseData(table);
    });
    //console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};

const baseData = (table) => {
  table.increments("id", {
    primaryKey: true,
    notNullable: true,
  });
  table.datetime("createdAt").notNullable();
  table.datetime("updatedAt");
};
const setting = async (knex) => {
  try {
    const tbl = "settings";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("name");
      table.string("jsonData");
      baseData(table);
    });

    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const initTable = async (knex) => {
  return new Promise(async (res, rej) => {
    let tables = [];
    // await createUsersTable(knex);
    // var tb =
    // await createUsers(knex);
    // tables.push(tb);
    // tb = await createWeighStation(knex);
    // tables.push(tb);
    // tb = await createCustomer(knex);
    // tables.push(tb);
    // tb = await createCompany(knex);
    // tables.push(tb);
    let tb = await setting(knex);
    tables.push(tb);
    tb = await socials(knex);
    tables.push(tb);
    tb = await groupFb(knex);
    tables.push(tb);
    tb = await postGroup(knex);
    tables.push(tb);
    tb = await reportArticle(knex);
    tables.push(tb);
    tb = await article(knex);
    tables.push(tb);
    res(tables);
    // await afterTabletramCan(knex);
  });
};
const afterTabletramCan = async (knex) => {
  let column = "isActive";
  let exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.boolean(column);
    });
  }
  column = "ieGoods";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
  column = "tareKg";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.double(column);
    });
  }
  column = "price";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.double(column);
    });
  }
  column = "productName";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }

  column = "unit";
  exists = await knex.schema.hasColumn("weighStation", column);
  if (!exists) {
    await knex.schema.table("weighStation", async (table1) => {
      table1.string(column);
    });
  }
};

const socials = async (knex) => {
  try {
    const tbl = "social";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("userName", 250).notNullable();
      table.string("password", 250).notNullable();
      table.string("uid", 250);
      table.string("cookies", 250);
      table.string("proxy", 250);
      table.string("status");
      table.string("active");
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const article = async (knex) => {
  try {
    const tbl = "article";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("title", 250).notNullable();
      table.string("content", 250).notNullable();
      table.string("media", 250);
      table.string("linkProducts", 250);
      table.string("comments");
      table.string("type");//media status
      table.integer('randomMedia')
      table.boolean("active");
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const groupFb = async (knex) => {
  try {
    const tbl = "groupFb";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.integer("groupId", 250).notNullable();
      table.string("uid").notNullable();
      table.string("name", 250);
      table.string("member", 250);
      table.boolean("status");// 
      table.string("active");
      table.string("socialId");
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};

const postGroup = async (knex) => {
  try {
    const tbl = "postGroup";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("title", 250).notNullable();
      table.string("images", 250);
      table.string("content");
      table.string("shortenLink");
      table.string("comments");
      table.string("active");
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
const reportArticle = async (knex) => {
  try {
    const tbl = "reportArticle";
    const hasTable = await knex.schema.hasTable(tbl);
    if (hasTable) {
      //  console.log(tbl, "already exist!");
      return tbl;
    }
    await knex.schema.createTable(tbl, (table) => {
      table.string("nameGroup");
      table.string('category').notNullable();
      table.string("title");
      table.integer("articleId").notNullable();
      table.integer("groupId");
      table.string("uid");
      table.integer("count");
      table.string("status");// thất bại, xét duyệt, hoàn thành
      baseData(table);
    });
    // console.log(tbl, "successfully created");
    return tbl;
  } catch (error) {
    console.error(error.message);
  }
};
module.exports = { initTable };
