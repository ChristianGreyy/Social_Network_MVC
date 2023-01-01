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
    remoteUser: user,
    heading: "About",
    title: user.firstName + " " + user.lastName,
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
    remoteUser: user,
    heading: "Timeline",
    title: user.firstName + " " + user.lastName,
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
    remoteUser: user,
    heading: "Friends",
    title: user.firstName + " " + user.lastName,
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
    remoteUser: user,
    heading: "Photos",
    title: user.firstName + " " + user.lastName,
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
    remoteUser: user,
    heading: "Videos",
    title: user.firstName + " " + user.lastName,
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
    remoteUser: user,
    heading: "Groups",
    title: user.firstName + " " + user.lastName,
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
    remoteUser: user,
    heading: "Analytics",
    title: user.firstName + " " + user.lastName,
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
