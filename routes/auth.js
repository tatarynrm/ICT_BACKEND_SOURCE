const express = require("express");
const { login, getMe } = require("../controllers/auth");
const checkAuth = require("../middleware/checkAuth");
const router = express.Router();

router.route("/login").post(login);
router.route("/me").get(checkAuth, getMe);
module.exports = router;
