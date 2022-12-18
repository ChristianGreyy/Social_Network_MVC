const express = require("express");
const validate = require("../../middlewares/validate");
const { authRender } = require("../../middlewares/auth-render");
const userController = require("../../controllers/view/user.view.controller");

const router = express.Router();

router.get("/:slug/about", authRender, userController.about);
router.get("/:slug/friends", authRender, userController.friends);
router.get("/:slug/photos", authRender, userController.photos);
router.get("/:slug/videos", authRender, userController.videos);
router.get("/:slug/groups", authRender, userController.groups);
router.get("/:slug/statistics", authRender, userController.statistics);
router.get("/:slug", authRender, userController.timeline);

module.exports = router;
