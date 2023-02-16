const express = require("express");
const validate = require("../../middlewares/validate");
const notificationController = require("../../controllers/view/notification.view.controller.js");
const { viewGetRemoteUser } = require("../../middlewares/user.middleware");
const router = express.Router();

router.get("/", viewGetRemoteUser, notificationController.notificationsDetail);

module.exports = router;
