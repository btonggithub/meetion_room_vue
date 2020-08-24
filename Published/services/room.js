const connection = require("../configs/database");
const config = require("../configs");
const table = "tb_rooms";

module.exports = {
  findSelect() {
    return new Promise((resolve, reject) => {
      connection.query(`select r_id,r_name from ${table} order by r_id`, (error, result) => {
        if (error) return reject(error);
        resolve(result);
      });
    });
  },
  findForBooking(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `
      select 
        r_id,
        r_image,
        r_name,
        r_capacity,
        (select count(*) from tb_bookings where tb_rooms_r_id = r_id and bk_status = 'pending') as r_booking ,
        r_detail
      from ${table}
      where r_id = ?`,
        [id],
        (error, result) => {
          if (error) return reject(error);
          resolve(result.length == 0 ? null : result[0]);
        }
      );
    });
  },
  find(value) {
    return new Promise((resolve, reject) => {
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
      sqls.select += " order by r_updated desc";

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
        `delete from ${table} where r_id=?`,
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
      const $query = `
      update ${table} set
        r_name=?,
        r_detail=?,
        r_image=?,
        r_capacity=?,
        r_updated =NOW()
      where r_id=?`;
      connection.query(
        $query,
        [value.r_name, value.r_detail, value.r_image, value.r_capacity, id],
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  },
};
