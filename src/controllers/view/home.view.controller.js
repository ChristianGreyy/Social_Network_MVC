const catchAsync = require("../../utils/catchAsync");

const home = catchAsync(async (req, res) => {
  res.render("index", {
    title: "Trang chủ",
    heading: "NEWSFEED",
    likesTotal: req.likesTotal,
    likedUsers: req.likedUsers,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    remoteUser: req.remoteUser,
  });
});

module.exports = {
  home,
};
