const httpStatus = require("http-status");
const { Notification } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

const notificationsDetail = catchAsync(async (req, res) => {
  const notifications = await Notification.find({
    receiver: req.user.id,
  }).populate("sender");

  console.log(req.user);
  console.log(req.remoteUser);

  res.render("notifications", {
    remoteUser: req.remoteUser,
    user: req.user,
    heading: "Notification",
    title: "Thông báo",
    likesTotal: req.likesTotal,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    notifications,
  });
});

module.exports = {
  notificationsDetail,
};
