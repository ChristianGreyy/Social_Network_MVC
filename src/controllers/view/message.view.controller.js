const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");
const { User } = require("../../models");

const messenger = catchAsync(async (req, res) => {
  const { userSlug } = req.params;
  const messenger = await User.findOne({ slug: userSlug });
  res.render("chat-messenger", {
    title: "Messenger",
    heading: "NEWSFEED",
    likesTotal: req.likesTotal,
    messenger: messenger,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
  });
});

module.exports = {
  messenger,
};
