const express = require("express");
const validate = require("../../middlewares/validate");
const { authRender } = require("../../middlewares/auth-render");
const userController = require("../../controllers/view/user.view.controller");
const {
  viewGetRemoteUser,
  viewGetLikesTotal,
} = require("../../middlewares/user.middleware");

const router = express.Router();

router.get("/:slug/about", authRender, viewGetRemoteUser, userController.about);
router.get(
  "/:slug/friends",
  authRender,
  viewGetRemoteUser,
  userController.friends
);
router.get(
  "/:slug/photos",
  authRender,
  viewGetRemoteUser,
  userController.photos
);
router.get(
  "/:slug/videos",
  authRender,
  viewGetRemoteUser,
  userController.videos
);
router.get(
  "/:slug/groups",
  authRender,
  viewGetRemoteUser,
  userController.groups
);
router.get(
  "/:slug/statistics",
  authRender,
  viewGetRemoteUser,
  userController.statistics
);
router.get(
  "/:slug",
  authRender,
  viewGetRemoteUser,
  viewGetLikesTotal,
  userController.timeline
);

module.exports = router;
