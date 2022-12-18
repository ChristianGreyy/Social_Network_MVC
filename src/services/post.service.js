const httpStatus = require("http-status");
const { Post } = require("../models");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (postBody) => {
  return Post.create(postBody);
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
const queryPosts = async (filter, options) => {
  const posts = await Post.paginate(filter, options);
  return posts;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Post>}
 */
const getPostById = async (id) => {
  return Post.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Post>}
 */
const getPostByEmail = async (email) => {
  return Post.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Post>}
 */
const updatePostById = async (userId, updateBody) => {
  const user = await getPostById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  if (updateBody.email && (await Post.isEmailTaken(updateBody.email, userId))) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  }
  Object.assign(user, updateBody);
  await user.save();
  return user;
};

/**
 * Delete user by id
 * @param {ObjectId} userId
 * @returns {Promise<Post>}
 */
const deletePostById = async (userId) => {
  const user = await getPostById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createPost,
  queryPosts,
  getPostById,
  getPostByEmail,
  updatePostById,
  deletePostById,
};
