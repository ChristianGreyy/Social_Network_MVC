const express = require("express");
const homeRouter = require("./home.view.route");
const authRoute = require("./auth.view.route");
const userRoute = require("./user.view.route");
const messageRoute = require("./message.view.route");
const settingRoute = require("./setting.view.route");
const notificationRoute = require("./notification.view.route");
const postRoute = require("./post.view.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/chat-messenger",
    route: messageRoute,
  },
  {
    path: "/settings",
    route: settingRoute,
  },
  {
    path: "/notifications",
    route: notificationRoute,
  },
  {
    path: "/post",
    route: postRoute,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/",
    route: homeRouter,
  },
];

defaultRoutes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
