const httpStatus = require("http-status");
const { User } = require("../../models");
const catchAsync = require("../../utils/catchAsync");

const about = catchAsync(async (req, res) => {
  res.render("about", {
    remoteUser: req.remoteUser,
    heading: "About",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    imagePost: req.imagePost,
  });
});

const timeline = catchAsync(async (req, res) => {
  res.render("timeline", {
    remoteUser: req.remoteUser,
    heading: "Timeline",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
    likesTotal: req.likesTotal,
    likedUsers: req.likedUsers,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
  });
});

const friends = catchAsync(async (req, res) => {
  res.render("timeline-friends", {
    remoteUser: req.remoteUser,
    heading: "Friends",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
  });
});

const photos = catchAsync(async (req, res) => {
  console.log(req.imagePost);
  res.render("timeline-photos", {
    remoteUser: req.remoteUser,
    heading: "Photos",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
    imagePost: req.imagePost,
  });
});

const videos = catchAsync(async (req, res) => {
  res.render("timeline-videos", {
    remoteUser: req.remoteUser,
    heading: "Videos",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
  });
});

const groups = catchAsync(async (req, res) => {
  res.render("timeline-groups", {
    remoteUser: req.remoteUser,
    heading: "Groups",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
  });
});

const statistics = catchAsync(async (req, res) => {
  res.render("statistics", {
    remoteUser: req.remoteUser,
    heading: "Analytics",
    title: req.remoteUser.firstName + " " + req.remoteUser.lastName,
    unReadNumber: req.unReadNumber,
    unReadNotiNumber: req.unReadNotiNumber,
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
