const express = require("express");
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const compression = require("compression");
const cors = require("cors");
const passport = require("passport");
const httpStatus = require("http-status");
const config = require("./config/config");
const morgan = require("./config/morgan");
const { jwtStrategy } = require("./config/passport");
const { authLimiter } = require("./middlewares/rateLimiter");
const apiRoutes = require("./routes/v1");
const viewRoutes = require("./routes/view");
const { errorConverter, errorHandler } = require("./middlewares/error");
const ApiError = require("./utils/ApiError");
const path = require("path");
const cookieParser = require("cookie-parser");

const app = express();

if (config.env !== "test") {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

// view engine
app.set("views", path.join(__dirname, "./views"));
app.set("view engine", "ejs");

app.use(express.static(path.join(__dirname, "./public")));

// set security HTTP headers
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: false,
    directives: {
      defaultSrc: ["'self'", "https: *"],
      scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'", "https: *"],
      objectSrc: ["'none'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https: *"],
      fontSrc: ["'self'", "'unsafe-inline'", "https: *"],
      imgSrc: ["'self'", "https: *", "data:", "blob:"],
      mediaSrc: ["self", "http: *", "blob:"],
      upgradeInsecureRequests: [],
    },
  })
);

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());
app.use(mongoSanitize());

// gzip compression
app.use(compression());

// enable cors
app.use(cors());
app.options("*", cors());

// jwt authentication
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

// limit repeated failed requests to auth endpoints
if (config.env === "production") {
  app.use("/v1/auth", authLimiter);
}

// cookie parser
app.use(cookieParser("hung"));

// v1 api routes
app.use("/api/v1", apiRoutes);

// view routes
const { authRender } = require("./middlewares/auth-render");
const {
  viewGetUnreadMessageNumber,
} = require("./middlewares/message.middleware");
const {
  viewGetUnreadNotificationNumber,
} = require("./middlewares/notification.middleware");
app.use(
  authRender,
  viewGetUnreadMessageNumber,
  viewGetUnreadNotificationNumber,
  viewRoutes
);

app.get("/favicon.ico", (req, res, next) => {
  return next();
});
// send back a 404 error for any unknown api request
app.use((req, res, next) => {
  next(new ApiError(httpStatus.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

module.exports = app;
