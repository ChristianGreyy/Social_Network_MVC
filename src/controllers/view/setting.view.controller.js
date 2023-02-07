const httpStatus = require("http-status");
const { User } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

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

module.exports = {
  editProfile,
};
