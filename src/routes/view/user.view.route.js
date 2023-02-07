const express = require("express");
const validate = require("../../middlewares/validate");
const userController = require("../../controllers/view/user.view.controller");
const {
  viewGetRemoteUser,
  viewGetLikesTotal,
} = require("../../middlewares/user.middleware");

const {
  viewGetRemoteUserImagePost,
} = require("../../middlewares/post.middleware");

const router = express.Router();

router.get(
  "/:slug/about",
  viewGetRemoteUser,
  viewGetRemoteUserImagePost,
  userController.about
);
router.get("/:slug/friends", viewGetRemoteUser, userController.friends);
router.get(
  "/:slug/photos",
  viewGetRemoteUser,
  viewGetRemoteUserImagePost,
  userController.photos
);
router.get("/:slug/videos", viewGetRemoteUser, userController.videos);
router.get("/:slug/groups", viewGetRemoteUser, userController.groups);
router.get("/:slug/statistics", viewGetRemoteUser, userController.statistics);
router.get(
  "/:slug",
  viewGetRemoteUser,
  viewGetLikesTotal,
  userController.timeline
);

module.exports = router;
