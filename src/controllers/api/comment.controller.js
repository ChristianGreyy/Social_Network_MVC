const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { commentService } = require("../../services");
const socket = require("../../config/socket");

const createComment = catchAsync(async (req, res) => {
  req.body["author"] = req.user._id;
  const comment = await commentService.createComment(req.body);
  socket.getIo().emit("getComments", comment);
  res.status(httpStatus.CREATED).send(comment);
});

const getComments = catchAsync(async (req, res) => {
  console.log(req.query);
  const filter = pick(req.query, ["post"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "populate"]);
  const result = await commentService.queryComments(filter, options);
  res.send(result);
});

const getComment = catchAsync(async (req, res) => {
  const comment = await commentService.getCommentById(req.params.commentId);
  if (!comment) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }
  res.send(comment);
});

const updateComment = catchAsync(async (req, res) => {
  const comment = await commentService.updateCommentById(
    req.params.commentId,
    req.body
  );
  res.send(comment);
});

const deleteComment = catchAsync(async (req, res) => {
  await commentService.deleteCommentById(req.params.commentId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
