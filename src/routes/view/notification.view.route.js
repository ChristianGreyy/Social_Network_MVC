const express = require("express");
const validate = require("../../middlewares/validate");
const notificationController = require("../../controllers/view/notification.view.controller.js");

const router = express.Router();

router.get("/", notificationController.notificationsDetail);

module.exports = router;
