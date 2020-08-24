const connection = require("../configs/database");
const config = require("../configs");
const { Result } = require("express-validator");
const { tolocalDate_EN, toResponseDate_US } = require("../utility/datetime");

const table = {
  bk: "tb_bookings",
  bkeq: "tb_bookings_has_tb_equipments",
};

module.exports = {
  findByCheckDataTime({ bk_time_start, bk_time_end, tb_rooms_r_id }) {
    return new Promise((resolve, reject) => {
      const start = tolocalDate_EN(bk_time_start);
      const end = tolocalDate_EN(bk_time_end);

      const sqls = `
      select count(*) as bk_count 
      from ${table.bk} 
      where 
       ( bk_time_start between ${connection.escape(
         start
       )} and ${connection.escape(end)}
      or 
        bk_time_end between ${connection.escape(start)} and ${connection.escape(
        end
      )} )
      and 
        tb_rooms_r_id = ${tb_rooms_r_id}`;
      connection.query(sqls, (error, result) => {
        if (error) return reject(error);
        resolve(result.length > 0 ? result[0].bk_count > 0 : false);
      });
    });
  },
  findById(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `select * from ${table.bk} where bk_id = ?`,
        id,
        (error, result) => {
          if (error) return reject(error);
          resolve(result.length > 0 ? result[0] : null);
        }
      );
    });
  },
  findByRoomId(roomId) {
    return new Promise((resolve, reject) => {
      connection.query(
        `select * from ${table.bk} 
        where tb_rooms_r_id = ? 
        and bk_status <> 'not allowed'`,
        [roomId],
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  },
  findHistory(value, userId) {
    return new Promise((resolve, reject) => {
      const limitPage = config.limitPage;
      const startPage = ((value.page || 1) - 1) * limitPage;
      const sqls = {
        count: `select count(*) as rcount from ${
          table.bk
        } where tb_users_u_id = ${connection.escape(userId)}`,
        select: `SELECT * FROM ${
          table.bk
        } where tb_users_u_id = ${connection.escape(userId)}`,
      };

      if (value.search_key && value.search_text) {
        const key = value.search_key;
        const txt = value.search_text;
        const sqlSerch = ` && ${connection.escapeId(
          key
        )} like ${connection.escape(`%${txt}%`)}`;
        sqls.count += sqlSerch;
        sqls.select += sqlSerch;
      }

      // เรียงลำดับ ข้อมูล
      sqls.select += " order by bk_created desc";

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
          result.forEach((item) => {
            item.bk_time_start = toResponseDate_US(item.bk_time_start);
            item.bk_time_end = toResponseDate_US(item.bk_time_end);
          });

          items.result = result;
          return resolve(items);
        });
      });
    });
  },
  find(value) {
    return new Promise((resolve, reject) => {
      const limitPage = config.limitPage;
      const startPage = ((value.page || 1) - 1) * limitPage;
      const sqls = {
        count: `select count(*) as rcount from ${table.bk}`,
        select: `SELECT * FROM ${table.bk}`,
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
      sqls.select += " order by bk_created desc";

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

          // result.forEach((item) => {
          //   item.bk_time_start = toResponseDate_US(item.bk_time_start);
          //   item.bk_time_end = toResponseDate_US(item.bk_time_end);
          // });

          items.result = result;
          return resolve(items);
        });
      });
    });
  },
  onCreate(value) {
    return new Promise((resolve, reject) => {
      //ตรวจสอบวันที่เลือกไปแล้ว
      this.findByCheckDataTime(value)
        .then((checkInvalid) => {
          console.log(checkInvalid);
          if (checkInvalid)
            throw new Error("Cannot add this datetime please check again.");

          connection.beginTransaction((tsError) => {
            if (tsError) return reject(tsError);

            // mapping data and inset into tb_bookings
            const bkModel = {
              bk_title: value.bk_title,
              bk_detail: value.bk_detail,
              bk_time_start: tolocalDate_EN(value.bk_time_start),
              bk_time_end: tolocalDate_EN(value.bk_time_end),
              tb_users_u_id: value.tb_users_u_id,
              tb_rooms_r_id: value.tb_rooms_r_id,
            };

            if (bkModel.bk_time_start > bkModel.bk_time_end) {
              return reject(
                new Error("The start date not must be more than end date!")
              );
            }

            connection.query(
              `insert into ${table.bk} set ?`,
              bkModel,
              (bkError, bkResult) => {
                if (bkError) {
                  connection.rollback();
                  return reject(bkError);
                }

                // mapping data and inset into tb_bookings_has_tb_equipments
                const tb_bookings_bk_id = bkResult.insertId;
                const bkeqModel = [];
                value.equipments.forEach((tb_equipments_eq_id) => {
                  bkeqModel.push([tb_bookings_bk_id, tb_equipments_eq_id]);
                });

                // หากไมมีการเลือกอุปกรณ์ ห้องประชุม ให้ทำการ commit and return ออกไปเลย
                if (bkeqModel.length <= 0)
                  return connection.commit((cmError) => {
                    if (cmError) {
                      connection.rollback();
                      return reject(cmError);
                    }
                    resolve(bkResult);
                  });

                connection.query(
                  `insert into ${table.bkeq} (tb_bookings_bk_id, tb_equipments_eq_id) value ?`,
                  [bkeqModel],
                  (bkeqError, bkeqResult) => {
                    if (bkeqError) {
                      connection.rollback();
                      return reject(bkeqError);
                    }
                    connection.commit((cmError) => {
                      if (cmError) {
                        connection.rollback();
                        return reject(cmError);
                      }
                      resolve(bkeqResult);
                    });
                  }
                );
              }
            );
          });
        })
        .catch(reject);
    });
  },
  onUpdate(id, value) {
    return new Promise((resolve, reject) => {
      connection.query(
        `update ${
          table.bk
        } set ? , bk_updated = now() where bk_id = ${connection.escape(id)}`,
        value,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  },
  onDelete(id) {
    return new Promise((resolve, reject) => {
      connection.query(
        `delete from ${table.bk} where bk_id =?`,
        id,
        (error, result) => {
          if (error) return reject(error);
          resolve(result);
        }
      );
    });
  },
};
