const config = require("../config/config");
const { promisify } = require("util");
const httpStatus = require("http-status");
const catchAsync = require("../utils/catchAsync");
const jwt = require("jsonwebtoken");
const { User, Token } = require("../models");
const ApiError = require("../utils/ApiError");
const { tokenService } = require("../services");
const { tokenTypes } = require("../config/tokens");

exports.authRender = catchAsync(async (req, res, next) => {
  if (req.path.includes("auth")) {
    return next();
  }
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }

  // Check token doc is in client?
  if (!token) {
    return res.redirect("/auth/login");
    // return next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
  }
  let payload;
  try {
    payload = await promisify(jwt.verify)(token, config.jwt.secret);
  } catch (err) {
    return res.redirect("/auth/login");
  }

  // Check token doc is in database?
  const tokenDoc = await Token.findOne({
    token,
    type: tokenTypes.REFRESH,
    user: payload.sub,
    blacklisted: false,
  });
  if (!tokenDoc) {
    return res.redirect("/auth/login");
  }

  // console.log(payload);
  const currentUser = await User.findById(payload.sub).select(
    "-isEmailVerified"
  );
  // Check user exists?
  if (!currentUser) {
    // return next(new ApiError(httpStatus.UNAUTHORIZED, "Please authenticate"));
    return res.redirect("/auth/login");
  }

  res.locals.user = currentUser;
  req.user = currentUser;
  return next();
});
