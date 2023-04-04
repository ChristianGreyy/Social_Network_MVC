const express = require("express");
const validate = require("../../middlewares/validate");
const settingController = require("../../controllers/view/setting.view.controller");
const {
  viewGetRemoteUser,
  viewGetLikesTotal,
} = require("../../middlewares/user.middleware");

const router = express.Router();

router.get(
  "/general-setting",
  viewGetRemoteUser,
  viewGetLikesTotal,
  settingController.generalSetting
);

router.get(
  "/edit-profile",
  viewGetRemoteUser,
  viewGetLikesTotal,
  settingController.editProfile
);

router.get(
  "/notification",
  viewGetRemoteUser,
  viewGetLikesTotal,
  settingController.notification
);

router.get(
  "/messages",
  viewGetRemoteUser,
  viewGetLikesTotal,
  settingController.messages
);

module.exports = router;
