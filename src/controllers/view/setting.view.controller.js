const catchAsync = require("../../utils/catchAsync");

const generalSetting = catchAsync(async (req, res) => {
  res.render("setting", {
    heading: "Edit Profile",
    remoteUser: req.remoteUser,
    path: req.path,
    user: req.user,
    title: req.user.firstName + " " + req.user.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    likesTotal: req.likesTotal,
    likedUsers: req.likedUsers,
  });
});

const editProfile = catchAsync(async (req, res) => {
  res.render("setting", {
    heading: "Edit Profile",
    remoteUser: req.remoteUser,
    path: req.path,
    user: req.user,
    title: req.user.firstName + " " + req.user.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    likesTotal: req.likesTotal,
    likedUsers: req.likedUsers,
  });
});

const notification = catchAsync(async (req, res) => {
  res.render("setting", {
    heading: "Edit Profile",
    remoteUser: req.remoteUser,
    path: req.path,
    user: req.user,
    title: req.user.firstName + " " + req.user.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    likesTotal: req.likesTotal,
    likedUsers: req.likedUsers,
  });
});

const messages = catchAsync(async (req, res) => {
  res.render("setting", {
    heading: "Edit Profile",
    remoteUser: req.remoteUser,
    path: req.path,
    user: req.user,
    title: req.user.firstName + " " + req.user.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    likesTotal: req.likesTotal,
    likedUsers: req.likedUsers,
  });
});

module.exports = {
  generalSetting,
  editProfile,
  notification,
  messages,
};
