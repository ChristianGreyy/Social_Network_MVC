const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { User } = require("../../models");

const messenger = catchAsync(async (req, res) => {
  const { userSlug } = req.params;
  const messenger = await User.findOne({ slug: userSlug });
  console.log(messenger);
  res.render("chat-messenger", {
    title: "Trang chủ",
    heading: "NEWSFEED",
    likesTotal: req.likesTotal,
    messenger: messenger,
  });
});

module.exports = {
  messenger,
};
