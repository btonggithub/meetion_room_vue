const express = require("express");
const server = express();
const cors = require("cors");
const expresssession = require("express-session");
const bodyParser = require("body-parser");
const { body, validationResult, Result } = require("express-validator");
const config = require("./configs");
const dotenv = require("dotenv");

const PORT = 3000;

dotenv.config();
server.use(cors());
//ตั้งค่าการใช้งาน session ระบบ
server.use(
  expresssession({
    secret: "begin node tutorial key",
    resave: false,
    saveUninitialized: true,
    cookie: {},
    // cookie: { secure: true }
  })
);

// ตั้งค่าการ parse variable เมื่อ client request data เข้ามา ทั้งแบบ formdata, json
// parse application/x-www-form-urlencoded
server.use(bodyParser.urlencoded({ extended: false, limit: "200MB" }));
// parse application/json
server.use(bodyParser.json({ limit: "200MB" }));

// Allow content
server.use("/api/uploads", express.static(`${__dirname}/uploads/equipments`));
server.use("/api/uploads", express.static(`${__dirname}/uploads/rooms`));

// set use frontend
server.use(express.static(`${__dirname}/www`));

// middleware custom function
server.use(require("./configs/middleware"));
// เรียกใช้งาน routes
server.use("/api", require("./routes"));

server.get("*", (req, res) => {
  if (process.env.ENV === 'production') return res.sendFile(`${__dirname}/www/index.html`);
  return res.end(`<h1>Backend server is started.</h1>`);
});

server.listen(PORT, () => {
  // server.js
  console.log(`ENV is ${process.env.ENV}`);
  console.log(`Server is started. Post ${PORT}.`);
});
