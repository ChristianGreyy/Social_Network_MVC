const httpStatus = require("http-status");
const { Message, Post } = require("../models");
const { postService } = require(".");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");

/**
 * Create a message
 * @param {Object} messageBody
 * @returns {Promise<Message>}
 */
const createMessage = async (messageBody) => {
  let newMessage = await Message.create(messageBody);
  newMessage = await Message.paginateAggregrate(
    { _id: newMessage._id.toString() },
    { populatePk: "documents.document" }
  );
  console.log(newMessage);
  return newMessage;
};

/**
 * Query for messages
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryMessages = async (filter, options) => {
  const messages = await Message.paginateAggregrate(filter, options);
  return messages;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Message>}
 */
const getMessageById = async (id) => {
  return Message.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Message>}
 */
const getMessageByEmail = async (email) => {
  return Message.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Message>}
 */
const updateMessageById = async (userId, updateBody) => {
  const user = await getMessageById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }
  if (
    updateBody.email &&
    (await Message.isEmailTaken(updateBody.email, userId))
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
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (userId) => {
  const user = await getMessageById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createMessage,
  queryMessages,
  getMessageById,
  getMessageByEmail,
  updateMessageById,
  deleteMessageById,
};
