const express = require("express");
const validate = require("../../middlewares/validate");
const messageController = require("../../controllers/view/message.view.controller");
const { authRender } = require("../../middlewares/auth-render");

const router = express.Router();

router.get("/:userSlug", authRender, messageController.messenger);
router.get("/", authRender, messageController.messenger);

module.exports = router;
