const express = require("express");
const validate = require("../../middlewares/validate");
const messageController = require("../../controllers/view/message.view.controller");

const router = express.Router();

router.get("/:userSlug", messageController.messenger);
router.get("/", messageController.messenger);

module.exports = router;
