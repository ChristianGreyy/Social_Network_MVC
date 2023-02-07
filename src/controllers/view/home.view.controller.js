const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");

const home = catchAsync(async (req, res) => {
  res.render("index", {
    title: "Trang chủ",
    heading: "NEWSFEED",
    likesTotal: req.likesTotal,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
  });
});

module.exports = {
  home,
};
