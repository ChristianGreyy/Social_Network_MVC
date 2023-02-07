const express = require("express");
const validate = require("../../middlewares/validate");
const settingController = require("../../controllers/view/setting.view.controller");
const {
  viewGetRemoteUser,
  viewGetLikesTotal,
} = require("../../middlewares/user.middleware");

const router = express.Router();

router.get(
  "/edit-profile",
  viewGetRemoteUser,
  viewGetLikesTotal,
  settingController.editProfile
);

module.exports = router;
