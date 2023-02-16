const express = require("express");
const homeController = require("../../controllers/view/home.view.controller");
const {
  viewGetRemoteUser,
  viewGetLikesTotal,
} = require("../../middlewares/user.middleware");

const router = express.Router();

router.get("/", viewGetRemoteUser, viewGetLikesTotal, homeController.home);

module.exports = router;
