const express = require("express");
const homeController = require("../../controllers/view/home.view.controller");
const { authRender } = require("../../middlewares/auth-render");

const router = express.Router();

router.get("/", authRender, homeController.home);

module.exports = router;
