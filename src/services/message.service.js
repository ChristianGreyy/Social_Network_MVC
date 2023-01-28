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
    { populatePk: "users.sender,users.receiver,documents.document" }
  );
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
 * Get messsage by id
 * @param {ObjectId} id
 * @returns {Promise<Message>}
 */
const getMessageById = async (id) => {
  return Message.findById(id);
};

/**
 * Get messsage by email
 * @param {string} email
 * @returns {Promise<Message>}
 */
const getMessageByEmail = async (email) => {
  return Message.findOne({ email });
};

/**
 * Update messsage by id
 * @param {ObjectId} messsageId
 * @param {Object} updateBody
 * @returns {Promise<Message>}
 */
const updateMessageById = async (messsageId, updateBody) => {
  const messsage = await getMessageById(messsageId);
  if (!messsage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }
  // if (
  //   updateBody.email &&
  //   (await Message.isEmailTaken(updateBody.email, messsageId))
  // ) {
  //   throw new ApiError(httpStatus.BAD_REQUEST, "Email already taken");
  // }
  Object.assign(messsage, updateBody);
  let updatedMessage = await messsage.save();

  updatedMessage = await Message.paginateAggregrate(
    { _id: updatedMessage._id.toString() },
    { populatePk: "users.sender,users.receiver,documents.document" }
  );

  return updatedMessage;
};

/**
 * Delete messsage by id
 * @param {ObjectId} messsageId
 * @returns {Promise<Message>}
 */
const deleteMessageById = async (messsageId) => {
  const messsage = await getMessageById(messsageId);
  if (!messsage) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found");
  }
  await messsage.remove();
  return messsage;
};

module.exports = {
  createMessage,
  queryMessages,
  getMessageById,
  getMessageByEmail,
  updateMessageById,
  deleteMessageById,
};
