const express = require("express");
const validate = require("../../middlewares/validate");
const authController = require("../../controllers/view/auth.view.controller");

const router = express.Router();

router.get("/login", authController.login);
router.get("/register", authController.register);
router.get("/forgot", authController.forgot);
router.get("/reset-password", authController.resetPassword);

module.exports = router;
