const httpStatus = require("http-status");
const { Post } = require("../models");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");
const commentService = require("./comment.service");

/**
 * Create a post
 * @param {Object} postBody
 * @returns {Promise<Post>}
 */
const createPost = async (postBody) => {
  let newPost = await Post.create(postBody);
  newPost = await Post.paginateAggregrate(
    { _id: newPost._id.toString() },
    { populatePk: "users.author" }
  );
  return newPost;
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
  let posts;
  if (filter["author"]) {
    posts = await Post.paginateAggregrate(filter, options);
  } else {
    posts = await Post.paginateAggregrate(filter, options);
  }

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
const updatePostById = async (postId, updateBody) => {
  const post = await getPostById(postId);
  if (!post) {
    throw new ApiError(httpStatus.NOT_FOUND, "Post not found");
  }

  Object.assign(post, updateBody);
  await post.save();
  return post;
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
