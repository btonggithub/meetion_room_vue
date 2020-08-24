const connection = require("../configs/database");
const { password_hash, password_varyfy } = require("../configs/security");
const table = "tb_users";
module.exports = {
  onRegister(value) {
    return new Promise((resolve, reject) => {
      value.u_password = password_hash(value.u_password);
      connection.query("insert into tb_users set?", value, (error, result) => {
        console.log(error)
        if (error) return reject(error);
        resolve(result);
      });
    });
  },
  onLogin(value) {
    return new Promise((resolve, reject) => {
      connection.query(
        "select * from tb_users where u_username=?",
        [value.u_username],
        (err, result) => {
          if (err) return reject(err);
          if (result.length > 0) {
            const userLogin = result[0];
            if (password_varyfy(value.u_password, userLogin.u_password)) {
              delete userLogin.u_password;
              delete userLogin.u_created;
              delete userLogin.u_updated;
              return resolve(userLogin);
            }
          }
          reject(new Error("Invalid Username or password"));
        }
      );
    });
  },
};

// Auto generate admin when user exists
connection.query(
  `select * from ${table} where u_username = 'admin'`,
  (error, result) => {
    if (error) return;
    if (result.length > 0) return;
    const generateAdmin = {
      u_username: "admin",
      u_password: password_hash("admin"),
      u_firstname: "Administrator",
      u_lastname: "Administrator",
      u_role: "admin",
    };
    console.log(generateAdmin);
    connection.query(
      `insert into ${table} set ?`,
      generateAdmin,
      (error, result) => {
        if (error) return;
        console.log(result);
      }
    );
  }
);
