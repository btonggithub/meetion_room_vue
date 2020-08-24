const connection = require("../configs/database");
const config = require("../configs");
const { SanitizersImpl } = require("express-validator/src/chain");
const table = "tb_equipments";
module.exports = {
  // แสดงข้อมูลทั้งหมด เพื่อเอาไปทำเป็น list checkbox booking page
  findAll() {
    return new Promise((resolve, reject) => {
      connection.query(
        `select eq_id,eq_name,eq_image from ${table}`,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  },
  find(value) {
    return new Promise((resolve, reject) => {
      // const bkkTime = new Date(
      //   new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
      // );
      // console.log("Bangkok time: " + bkkTime);

      const limitPage = config.limitPage;
      const startPage = ((value.page || 1) - 1) * limitPage;
      const sqls = {
        count: `select count(*) as rcount from ${table}`,
        select: `SELECT * FROM ${table}`,
      };

      if (value.search_key && value.search_text) {
        const key = value.search_key;
        const txt = value.search_text;
        const sqlSerch = ` where ${connection.escapeId(
          key
        )} like ${connection.escape(`%${txt}%`)}`;
        sqls.count += sqlSerch;
        sqls.select += sqlSerch;
      }

      // เรียงลำดับ ข้อมูล
      sqls.select += " order by eq_updated desc";

      connection.query(sqls.count, (error, result) => {
        if (error) return reject(result);
        const items = {
          result: [],
          rows: result[0].rcount,
          limit: limitPage,
        };

        //แบ่งหน้า
        sqls.select += ` limit ${connection.escape(startPage)},${limitPage}`;
        connection.query(sqls.select, (error, result) => {
          if (error) return reject(result);
          items.result = result;
          return resolve(items);
        });
      });
    });
  },
  findOne(column) {
    return new Promise((resolve, reject) => {
      connection.query(
        `select * from ${table} where?`,
        column,
        (error, result) => {
          if (error) return reject(error);
          resolve(result.length > 0 ? result[0] : null);
        }
      );
    });
  },
  onCreate(value) {
    return new Promise((resolve, reject) => {
      connection.query(`insert into ${table} set?`, value, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  },
  onDelete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `delete from ${table} where eq_id=?`,
        [id],
        (error, result) => {
          if (error) return reject();
          return resolve(result);
        }
      );
    });
  },
  onUpdate(id, value) {
    return new Promise((resolve, reject) => {
      // const bkkTime = new Date(
      //   new Date().toLocaleString("en-US", { timeZone: "Asia/Bangkok" })
      // );
      const $query = `
      update ${table} set
        eq_name=?,
        eq_detail=?,
        eq_image=?,
        eq_updated =NOW()
      where eq_id=?`;
      connection.query(
        $query,
        [value.eq_name, value.eq_detail, value.eq_image, id],
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  },
};
