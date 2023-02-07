const express = require("express");
const validate = require("../../middlewares/validate");
const postController = require("../../controllers/view/post.view.controller");
const {
  viewGetRemoteUser,
  viewGetLikesTotal,
} = require("../../middlewares/user.middleware");

const router = express.Router();

router.get("/:postId", viewGetLikesTotal, postController.postDetail);

module.exports = router;
