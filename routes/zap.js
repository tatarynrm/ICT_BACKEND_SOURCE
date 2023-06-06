const express = require("express");
const {
  createZap,
  getAllZap,
  getGroups,
  deleteZap,
} = require("../controllers/zap");

const router = express.Router();

router.route("/add").post(createZap);
router.route("/").post(getAllZap);
router.route("/groups").post(getGroups);
router.route("/delete").post(deleteZap);

module.exports = router;
