const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const postRoute = require("./post.route");
const messageRoute = require("./message.route");
const commentRoute = require("./comment.route");
const notificationRoute = require("./notification.route");
const docsRoute = require("./docs.route");
const opitonRoute = require("./option.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/users",
    route: userRoute,
  },
  {
    path: "/posts",
    route: postRoute,
  },
  {
    path: "/comments",
    route: commentRoute,
  },
  {
    path: "/messages",
    route: messageRoute,
  },
  {
    path: "/notifications",
    route: notificationRoute,
  },
  {
    path: "/options",
    route: opitonRoute,
  },
];

const devRoutes = [
  // routes available only in development mode
  {
    path: "/docs",
    route: docsRoute,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

/* istanbul ignore next */
if (config.env === "development") {
  devRoutes.forEach((route) => {
    router.use(route.path, route.route);
  });
}
module.exports = router;
