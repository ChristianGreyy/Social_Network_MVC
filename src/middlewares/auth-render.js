const config = require("../config/config");
const { promisify } = require("util");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const ApiError = require("../utils/ApiError");

exports.authRender = catchAsync(async (req, res, next) => {
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  console.log(token);
  if (!token) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  const decoded = await promisify(jwt.verify)(token, config.jwt.secret);
  // console.log(decoded);
  const currentUser = await User.findById(decoded.sub);
  if (!currentUser) {
    return next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }

  res.locals.user = currentUser;
  req.user = currentUser;
  return next();
});
