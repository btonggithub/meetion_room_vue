const mysql = require("mysql");
const config = require("./index");
// const addres = {
//   host: "127.0.0.1",
//   user: "root",
//   password: "password",
//   database: "meeting_room_prod",
//   charset: "utf8",
//   port: 3308,
// };

// Is production
// if (process.env.ENV === 'production') {
//   addres.host = "mysql_db";
//   addres.database = "meeting_room_prod";
//   addres.password = "password";
//   addres.port = 3306;
// }

// for docker registry image
const addres = {
  host: "mysql_db",
  user: "root",
  password: "password",
  database: "meeting_room_prod",
  charset: "utf8",
  port: 3306,
};

const connection = mysql.createConnection(addres);

connection.connect(function (err) {
  if (err) {
    console.error("error connecting: " + err.stack);
    return;
  }
  console.log("connected as id " + connection.threadId);
});

module.exports = connection;
