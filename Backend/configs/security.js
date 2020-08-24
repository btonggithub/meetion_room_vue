const crypto = require("crypto");
const { setTimeout } = require("timers");
const { EROFS } = require("constants");

//เข้ารหัส password เปลี่ยน package ได้ ตัวนี้พื้นฐาน
const security = {
  password_hash(password) {
    return crypto.createHash("sha1").update(password).digest("hex");
  },
  password_varyfy(password, password_hash) {
    return security.password_hash(password) === password_hash;
  },
  authenticated(req, res, next) {
    // req.session.userLogin = {
    //   u_id: 18,
    //   u_username: "admin123",
    //   u_firstname: "admin123",
    //   u_lastname: "admin123",
    //   u_role: "admin",
    // };

    try {
      if (req.session.userLogin) {
        return next();
      }
      throw new Error("Unauthorize.");
    } catch (error) {
      res.error(error, 401);
    }
  },
  //ตรวจสอบสิทธิ์การเข้าถึงหน้า
  isInRole(roles = []) {
    return (req, res, next) => {
      try {
        if (roles.indexOf(req.session.userLogin.u_role) >= 0) return next();
        throw new Error('Forbidden');
      } catch (error) {
        res.status(403).json({ message: error.message });
      }
    };
  },
};

module.exports = security;
