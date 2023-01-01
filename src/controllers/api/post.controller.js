const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { postService } = require("../../services");
const socket = require("../../config/socket");

const createPost = catchAsync(async (req, res) => {
  console.log(req.body);
  if (req.file) {
    req.body["photo"] = "/resources/photos/".concat(
      req.file.path.split("/")[req.file.path.split("/").length - 1]
    );
  }
  // console.log(req.user);
  req.body["author"] = req.user._id;
  const post = await postService.createPost(req.body);
  socket.getIo().emit("getNewPost", post);
  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["content", "author"]);
  if (req.query.friends == "true") {
    filter["author"] = { $in: req.userIdArray };
  }
  console.log(filter);

  const options = pick(req.query, [
    "sortBy",
    "limit",
    "page",
    "populatePk",
    "populateFk",
  ]);
  const result = await postService.queryPosts(filter, options);
  res.send(result);
});

const getPost = catchAsync(async (req, res) => {
  const post = await postService.getPostById(req.params.postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  res.send(post);
});

const updatePost = catchAsync(async (req, res) => {
  const post = await postService.updatePostById(req.params.postId, req.body);
  socket.getIo().emit("getUpdatedPost", post);
  res.send(post);
});

const deletePost = catchAsync(async (req, res) => {
  await postService.deletePostById(req.params.postId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
