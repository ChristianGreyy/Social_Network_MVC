const express = require("express");
const homeController = require("../../controllers/view/home.view.controller");
const { viewGetLikesTotal } = require("../../middlewares/user.middleware");

const router = express.Router();

router.get("/", viewGetLikesTotal, homeController.home);

module.exports = router;
