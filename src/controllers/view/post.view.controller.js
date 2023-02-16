const httpStatus = require("http-status");
const { Post } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

const postDetail = catchAsync(async (req, res) => {
  const post = await Post.findOne({ _id: req.params.postId });
  console.log(post);
  res.render("post", {
    remoteUser: req.remoteUser,
    heading: "Timeline",
    title: "Bài viết",
    likesTotal: req.likesTotal,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    post,
  });
});

module.exports = {
  postDetail,
};
