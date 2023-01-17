const express = require("express");
const homeRouter = require("./home.view.route");
const authRoute = require("./auth.view.route");
const userRoute = require("./user.view.route");
const messageRoute = require("./message.view.route");
const config = require("../../config/config");

const router = express.Router();

const defaultRoutes = [
  {
    path: "/chat-messenger",
    route: messageRoute,
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
