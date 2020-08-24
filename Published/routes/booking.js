const router = require("express").Router();
const { query, check, param } = require("express-validator");
const bookingService = require("../services/booking");
const roomService = require("../services/room");
const equipmentService = require("../services/equipment");
const { isInRole } = require("../configs/security");

// แสดงรายการห้องประชุม
router.get("/", [query("page").isInt()], async (req, res) => {
  try {
    req.validate();
    res.json(await roomService.find(req.query));
  } catch (error) {
    res.error(error);
  }
});

// แสดงข้อมูลอุปกรณ์ห้องประชุมทั้งหมด เพือ่ทำ list checkbox booking page
router.get("/equipments", async (req, res) => {
  try {
    res.json(await equipmentService.findAll());
  } catch (error) {
    res.error(error);
  }
});

// แสดงประวัติ การจองห้องประชุม
router.get("/history", [query("page").isInt()], async (req, res) => {
  try {
    req.validate();
    res.json(
      await bookingService.findHistory(req.query, req.session.userLogin.u_id)
    );
  } catch (error) {
    res.error(error);
  }
});

// แสดงรายละเอียดของห้องประชุม
router.get("/room/:id", async (req, res) => {
  try {
    const model = await roomService.findForBooking(req.params.id);
    if (!model) throw new Error("Not found item.");
    res.json(model);
  } catch (error) {
    res.error(error);
  }
});

// เพิ่มการจองห้องประชุม
router.post(
  "/",
  [
    check("bk_title").not().isEmpty(),
    check("bk_detail").exists(),
    check("bk_time_start").custom((value) => !isNaN(Date.parse(value))),
    check("bk_time_end").custom((value) => !isNaN(Date.parse(value))),
    check("equipments").custom((values) => {
      const arr = Array.isArray(values);
      if (arr && values.length >= 0) {
        return values.filter((item) => isNaN(item)).length == 0;
      }
    }),
    check("tb_rooms_r_id").isInt(),
  ],
  async (req, res) => {
    try {
      req.validate();
      req.body.tb_users_u_id = req.session.userLogin.u_id;
      res.json(await bookingService.onCreate(req.body));
    } catch (error) {
      res.error(error);
    }
  }
);


//ดึงข้อมูล ห้องประชุม มาทำ select
router.get("/rooms/select", async (req, res) => {
  try {
    res.json(await roomService.findSelect());
  } catch (error) {
    res.error(error);
  }
});

//#region สำหรับผู้ดูแลระบบ

// ดึงข้อมูลการจองห้องประชุมจาก room id มาใส่ ใน calenda
router.get(
  "/calendar/room/:id",
  isInRole(["admin"]),
  [param("id").isInt()],
  async (req, res) => {
    try {
      req.validate();
      res.json(await bookingService.findByRoomId(req.params.id));
    } catch (error) {
      res.error(error);
    }
  }
);

//ดึงข้อมูล แสดงรายการจอง ของสมาชิกทั้งหมด
router.get(
  "/manage",
  isInRole(["admin"]),
  [query("page").isInt()],
  async (req, res) => {
    try {
      req.validate();
      res.json(await bookingService.find(req.query));
    } catch (error) {
      res.error(error);
    }
  }
);

//แก้ไข สถานนะ การจอง เป็น อนุมัติ กับ ไม่อนูมัติ
router.put(
  "/manage/:id",
  isInRole(["admin"]),
  [
    param("id", "id ต้องเป็น เลขจำนวน").isInt(),
    check("bk_status", 'bk_status is in ("allowed", "not allowed")')
      .notEmpty()
      .isIn(["allowed", "not allowed"]),
  ],
  async (req, res) => {
    try {
      req.validate();
      const findItem = await bookingService.findById(req.params.id);
      if (!findItem) throw new Error("Not found item!");
      res.json(await bookingService.onUpdate(req.params.id, req.body));
    } catch (error) {
      res.error(error);
    }
  }
);

// ลบช้อมูลห้องประชุม
router.delete(
  "/manage/:id",
  isInRole(["admin"]),
  [param("id").isInt()],
  async (req, res) => {
    try {
      req.validate();

      const deleteItem = await bookingService.findById(req.params.id);
      if (!deleteItem) throw new Error("Not found item!");
      res.json(await bookingService.onDelete(deleteItem.bk_id));
    } catch (error) {
      res.error(error);
    }
  }
);

//#endregion

module.exports = router;
