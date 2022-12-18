const httpStatus = require("http-status");
const { Comment } = require("../models");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Comment>}
 */
const createComment = async (postBody) => {
  return Comment.create(postBody);
};

/**
 * Query for posts
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryComments = async (filter, options) => {
  const posts = await Comment.paginate(filter, options);
  return posts;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Comment>}
 */
const getCommentById = async (id) => {
  return Comment.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Comment>}
 */
const getCommentByEmail = async (email) => {
  return Comment.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Comment>}
 */
const updateCommentById = async (userId, updateBody) => {
  const user = await getCommentById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }
  if (
    updateBody.email &&
    (await Comment.isEmailTaken(updateBody.email, userId))
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Comment>}
 */
const deleteCommentById = async (userId) => {
  const user = await getCommentById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Comment not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createComment,
  queryComments,
  getCommentById,
  getCommentByEmail,
  updateCommentById,
  deleteCommentById,
};
