const httpStatus = require("http-status");
const { User } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

const about = catchAsync(async (req, res) => {
  res.render("about", {
    remoteUser: req.remoteUser,
    heading: "About",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
  });
});

const timeline = catchAsync(async (req, res) => {
  console.log(req.remoteUser);
  res.render("timeline", {
    remoteUser: req.remoteUser,
    heading: "Timeline",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
  });
});

const friends = catchAsync(async (req, res) => {
  res.render("timeline-friends", {
    remoteUser: req.remoteUser,
    heading: "Friends",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
  });
});

const photos = catchAsync(async (req, res) => {
  res.render("timeline-photos", {
    remoteUser: req.remoteUser,
    heading: "Photos",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
  });
});

const videos = catchAsync(async (req, res) => {
  res.render("timeline-videos", {
    remoteUser: req.remoteUser,
    heading: "Videos",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
  });
});

const groups = catchAsync(async (req, res) => {
  res.render("timeline-groups", {
    remoteUser: req.remoteUser,
    heading: "Groups",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
  });
});

const statistics = catchAsync(async (req, res) => {
  res.render("statistics", {
    remoteUser: req.remoteUser,
    heading: "Analytics",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
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
