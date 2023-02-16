const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { notificationService } = require("../../services");
const socket = require("../../config/socket");

const createNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.createNotification(req.body);
  socket.getIo().emit("getNotifications", notification);
  res.status(httpStatus.CREATED).send(notification);
});

const getNotifications = catchAsync(async (req, res) => {
  console.log(req.query);
  const filter = pick(req.query, ["post", "receiver"]);
  const options = pick(req.query, ["sortBy", "limit", "page", "populatePk"]);
  const result = await notificationService.queryNotifications(filter, options);
  res.send(result);
});

const getNotification = catchAsync(async (req, res) => {
  const notification = await notificationService.getNotificationById(
    req.params.notificationId
  );
  if (!notification) {
    throw new ApiError(httpStatus.NOT_FOUND, "Notification not found");
  }
  res.send(notification);
});

const updateNotification = catchAsync(async (req, res) => {
  console.log(req.body);

  const notification = await notificationService.updateNotificationById(
    req.params.notificationId,
    req.body
  );
  res.send(notification);
});

const deleteNotification = catchAsync(async (req, res) => {
  await notificationService.deleteNotificationById(req.params.notificationId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createNotification,
  getNotifications,
  getNotification,
  updateNotification,
  deleteNotification,
};
