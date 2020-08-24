const mysql = require("mysql");
const config = require("./index");
// const addres = {
//   host: "127.0.0.1",
//   user: "root",
//   password: "password",
//   database: "meeting_room_prod",
//   charset: "utf8",
// };

//Is production
// if (config.isProduction) {
// addres.host = "mysql_db";
// addres.database = "meeting_room_prod";
// }

const addres = {
  host: "mysql_db",
  user: "root",
  password: "123456",
  database: "meeting_room_prod",
  charset: "UTF8",
};

const connection = mysql.createConnection(addres);

connection.connect(function(err) {
  if (err) {
    console.error('error connecting: ' + err.stack);
    return;
  }

  console.log('connected as id ' + connection.threadId);
});

module.exports = connection;
