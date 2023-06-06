const express = require("express");
const { getCommentsById, addZapComment } = require("../controllers/comments");

const router = express.Router();

router.route("/:id").get(getCommentsById);
router.route("/add").post(addZapComment);

module.exports = router;
