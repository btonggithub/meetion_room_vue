const router = require("express").Router();
const service = require("../services/equipment");
const { check, query } = require("express-validator");
const base64Img = require("base64-img");
const fs = require("fs");
const path = require("path");
const uploadDir = path.resolve("uploads");
const equipDir = path.join(uploadDir, "equipments");

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
    const item = await service.findOne({ eq_id: req.params.id });
    if (!item) throw new Error("Not found item.");
    item.eq_image = base64Img.base64Sync(path.join(equipDir, item.eq_image));
    res.json(item);
  } catch (error) {
    res.error(error);
  }
});

router.post(
  "/",
  [check("eq_name").not().isEmpty(), check("eq_image").not().isEmpty()],
  async (req, res) => {
    try {
      req.validate();

      //ตรวจสอบ folder
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);
      // set filenaem
      let filename = `equip-${Date.now()}`;
      //แปลงข้อมูลรูปภาพ
      req.body.eq_image = base64Img
        .imgSync(req.body.eq_image, equipDir, filename)
        .replace(`${equipDir}/`, "");
      res.json({ message: await service.onCreate(req.body) });
    } catch (error) {
      const delImg = path.join(equipDir, req.body.eq_image || "");
      if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => {});
      res.error(error);
    }
  }
);

router.delete("/:id", async (req, res) => {
  try {
    const item = await service.findOne({ eq_id: req.params.id });
    if (!item) throw new Error("Not found item.");
    const deleteditem = await service.onDelete(item.eq_id);
    const deleteImg = path.join(equipDir, item.eq_image);
    if (fs.existsSync(deleteImg)) fs.unlinkSync(deleteImg);
    res.send(deleteditem);
  } catch (error) {
    res.error(error);
  }
});

router.put(
  "/:id",
  [check("eq_name").not().isEmpty(), check("eq_image").not().isEmpty()],
  async (req, res) => {
    try {
      req.validate();

      //หาข้อมูลเดิม
      const item = await service.findOne({ eq_id: req.params.id });
      if (!item) throw new Error("Not found item.");

      //ตรวจสอบ folder
      if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);
      if (!fs.existsSync(equipDir)) fs.mkdirSync(equipDir);

      //แปลงข้อมูลรูปภาพ
      req.body.eq_image = base64Img
        .imgSync(req.body.eq_image, equipDir, `equip-${Date.now()}`)
        .replace(`${equipDir}/`, "");

      const updateItem = await service.onUpdate(req.params.id, req.body);

      //ตรวจว่าแก้ไขข้อมูลสำเร็จหรือไม่
      if (updateItem.affectedRows > 0) {
        //ลบ รูปเก่า
        const delImg = path.join(equipDir, item.eq_image);
        if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => {});
      }
      res.json(updateItem);
    } catch (error) {
      const delImg = path.join(equipDir, req.body.eq_image || "");
      if (fs.existsSync(delImg)) fs.unlinkSync(delImg, () => {});
      res.error(error);
    }
  }
);

module.exports = router;
