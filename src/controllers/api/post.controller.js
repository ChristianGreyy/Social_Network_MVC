const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { postService } = require("../../services");
const socket = require("../../config/socket");

const createPost = catchAsync(async (req, res) => {
  if (req.file) {
    req.body[req.storeFile] = `/resources/${req.storeFile + "s"}/`.concat(
      req.file.path.split("/")[req.file.path.split("/").length - 1]
    );
  }
  req.body["author"] = req.user._id;
  const post = await postService.createPost(req.body);
  const userOnline = socket.getOnlineUser();
  req.user.friends.push({
    user: req.user.id,
  });
  const rooms = userOnline.reduce((result, user) => {
    let isFriend = false;
    req.user.friends.forEach((u) => {
      if (u.user.toString() == user.userId.toString()) {
        isFriend = true;
      }
    });
    if (isFriend) {
      result.push(user.socketId);
    }
    return result;
  }, []);

  console.log(rooms);
  socket.getIo().to(rooms).emit("getNewPost", post);

  res.status(httpStatus.CREATED).send(post);
});

const getPosts = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["content", "author", "_id"]);
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
