const router = require("express").Router();
const { authenticated, isInRole } = require("../configs/security");

// Accout route
router.use("/account", require("./account"));
// Equipment route
router.use("/equipment", authenticated,isInRole(['admin']), require("./equipment"));
// Room route
router.use("/room", authenticated, isInRole(['admin']), require("./room"));
// Booking
router.use("/booking", authenticated, require("./booking"));

module.exports = router;
