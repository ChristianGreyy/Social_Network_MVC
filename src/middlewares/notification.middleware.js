const mongoose = require("mongoose");
const { User, Notification } = require("../models");

exports.viewGetUnreadNotificationNumber = async (req, res, next) => {
  if (req.path.includes("auth")) return next();
  let notifications = await Notification.find({
    receiver: req.user.id,
    read: false,
  }).sort({
    createdAt: -1,
  });

  req.unReadNotiNumber = notifications.length;
  return next();
};
