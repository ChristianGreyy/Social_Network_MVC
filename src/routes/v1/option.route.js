const express = require("express");
const auth = require("../../middlewares/auth");
const validate = require("../../middlewares/validate");
const userValidation = require("../../validations/user.validation");
const userController = require("../../controllers/api/user.controller");

const router = express.Router();

router.get("/", (req, res, next) => {
  res.send("ok");
});

module.exports = router;
