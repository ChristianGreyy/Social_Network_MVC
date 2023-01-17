const express = require("express");
const homeController = require("../../controllers/view/home.view.controller");
const { authRender } = require("../../middlewares/auth-render");
const { viewGetLikesTotal } = require("../../middlewares/user.middleware");

const router = express.Router();

router.get("/", authRender, viewGetLikesTotal, homeController.home);

module.exports = router;
