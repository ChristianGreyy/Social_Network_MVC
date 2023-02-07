const httpStatus = require("http-status");
const { Notification, Post } = require("../models");
const { postService } = require(".");
const ApiError = require("../utils/ApiError");
const slugify = require("slugify");

/**
 * Create a notification
 * @param {Object} notificationBody
 * @returns {Promise<Notification>}
 */
const createNotification = async (notificationBody) => {
  const newNotification = await Notification.create(notificationBody);
  return newNotification;
};

/**
 * Query for notifications
 * @param {Object} filter - Mongo filter
 * @param {Object} options - Query options
 * @param {string} [options.sortBy] - Sort option in the format: sortField:(desc|asc)
 * @param {number} [options.limit] - Maximum number of results per page (default = 10)
 * @param {number} [options.page] - Current page (default = 1)
 * @returns {Promise<QueryResult>}
 */
const queryNotifications = async (filter, options) => {
  const notifications = await Notification.paginateAggregrate(filter, options);
  return notifications;
};

/**
 * Get user by id
 * @param {ObjectId} id
 * @returns {Promise<Notification>}
 */
const getNotificationById = async (id) => {
  return Notification.findById(id);
};

/**
 * Get user by email
 * @param {string} email
 * @returns {Promise<Notification>}
 */
const getNotificationByEmail = async (email) => {
  return Notification.findOne({ email });
};

/**
 * Update user by id
 * @param {ObjectId} userId
 * @param {Object} updateBody
 * @returns {Promise<Notification>}
 */
const updateNotificationById = async (userId, updateBody) => {
  const user = await getNotificationById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  }
  if (
    updateBody.email &&
    (await Notification.isEmailTaken(updateBody.email, userId))
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
 * @returns {Promise<Notification>}
 */
const deleteNotificationById = async (userId) => {
  const user = await getNotificationById(userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  }
  await user.remove();
  return user;
};

module.exports = {
  createNotification,
  queryNotifications,
  getNotificationById,
  getNotificationByEmail,
  updateNotificationById,
  deleteNotificationById,
};
