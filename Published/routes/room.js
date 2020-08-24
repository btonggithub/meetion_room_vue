const router = require("express").Router();
const service = require("../services/room");
const { check, query } = require("express-validator");
const base64Img = require("base64-img");
const fs = require("fs");
const path = require("path");
const uploadDir = path.resolve("uploads");
const roomDir = path.join(uploadDir, "rooms");

router.get(
  "/",
  [query("page").not().isEmpty().isInt().toInt()],
  async (req, res) => {
    try {
      req.validate();
      res.json(await service.find(req.query));
    } catch (error) {
      res.error(error);
    }
  }
);

// แสดงรายการแค่หนึ่ง รายการเพื่อนำไป แก้ไข
router.get("/:id", async (req, res) => {
  try {
    const item = await service.findOne({ r_id: req.params.id });
    if (!item) throw new Error("Not found item.");
    item.r_image = base64Img.base64Sync(path.join(roomDir, item.r_image));
    res.json(item);
  } catch (error) {
    res.error(error);
  }
});

// เพิ่ม ข้อมูลห้องประชุม
router.post(
  "/",
  [
    check("r_image").not().isEmpty(),
    check("r_name").not().isEmpty(),
    check("r_capacity").isInt(),
    check("r_detail").exists(),
  ],
  async (req, res) => {
    try {
      req.validate();

      //ตรวจสอบ folder
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);

      //แปลงข้อมูลรูปภาพ
      req.body.r_image = base64Img
        .imgSync(req.body.r_image, roomDir, `room-${Date.now()}`)
        .replace(`${roomDir}\\`, "");

      res.json({ message: await service.onCreate(req.body) });
    } catch (error) {
      // insert ไม่สำเร็จให้ทำการลบรูปภาพด้วย
      const delImg = path.join(roomDir, req.body.r_image || "");
      if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => {});
      res.error(error);
    }
  }
);

//delete
router.delete("/:id", async (req, res) => {
  try {
    const item = await service.findOne({ r_id: req.params.id });
    if (!item) throw new Error("Not found item.");
    const deleteditem = await service.onDelete(item.r_id);
    const deleteImg = path.join(roomDir, item.r_image);
    if (fs.existsSync(deleteImg)) fs.unlinkSync(deleteImg);
    res.send(deleteditem);
  } catch (error) {
    res.error(error);
  }
});

//put
router.put(
  "/:id",
  [
    check("r_image").not().isEmpty(),
    check("r_name").not().isEmpty(),
    check("r_capacity").isInt(),
    check("r_detail").exists(),
  ],
  async (req, res) => {
    try {
      req.validate();

      //หาข้อมูลเดิม
      const item = await service.findOne({ r_id: req.params.id });
      if (!item) throw new Error("Not found item.");

      //ตรวจสอบ folder
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      if (!fs.existsSync(roomDir)) fs.mkdirSync(roomDir);

      //แปลงข้อมูลรูปภาพ
      req.body.r_image = base64Img
        .imgSync(req.body.r_image, roomDir, `room-${Date.now()}`)
        .replace(`${roomDir}\\`, "");

      const updateItem = await service.onUpdate(req.params.id, req.body);

      //ตรวจว่าแก้ไขข้อมูลสำเร็จหรือไม่
      if (updateItem.affectedRows > 0) {
        //ลบ รูปเก่า
        const delImg = path.join(roomDir, item.r_image);
        if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => {});
      }
      res.json(updateItem);
    } catch (error) {
      // update ไม่สำเร็จให้ทำการลบรูปภาพด้วย
      const delImg = path.join(roomDir, req.body.r_image || "");
      if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => {});
      res.error(error);
    }
  }
);

module.exports = router;
