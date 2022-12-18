const httpStatus = require("http-status");
const { User } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

const about = catchAsync(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return res.json({
      msg: "Not found",
    });
  }

  res.render("about", {
    title: req.user.firstName + " " + req.user.lastName,
    heading: "About",
  });
});

const timeline = catchAsync(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return res.json({
      msg: "Not found",
    });
  }

  res.render("timeline", {
    title: req.user.firstName + " " + req.user.lastName,
    heading: "Timeline",
  });
});

const friends = catchAsync(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return res.json({
      msg: "Not found",
    });
  }

  res.render("timeline-friends", {
    title: req.user.firstName + " " + req.user.lastName,
    heading: "Friends",
  });
});

const photos = catchAsync(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return res.json({
      msg: "Not found",
    });
  }

  res.render("timeline-photos", {
    title: req.user.firstName + " " + req.user.lastName,
    heading: "Photos",
  });
});

const videos = catchAsync(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return res.json({
      msg: "Not found",
    });
  }

  res.render("timeline-videos", {
    title: req.user.firstName + " " + req.user.lastName,
    heading: "Videos",
  });
});

const groups = catchAsync(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return res.json({
      msg: "Not found",
    });
  }

  res.render("timeline-groups", {
    title: req.user.firstName + " " + req.user.lastName,
    heading: "Groups",
  });
});

const statistics = catchAsync(async (req, res) => {
  const user = await User.findOne({ slug: req.params.slug });
  if (!user) {
    return res.json({
      msg: "Not found",
    });
  }

  res.render("statistics", {
    title: req.user.firstName + " " + req.user.lastName,
    heading: "Analytics",
  });
});

module.exports = {
  timeline,
  about,
  friends,
  photos,
  videos,
  groups,
  statistics,
};
