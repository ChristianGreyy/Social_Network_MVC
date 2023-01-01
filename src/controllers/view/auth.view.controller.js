const httpStatus = require("http-status");
const catchAsync = require("../../utils/catchAsync");

const login = catchAsync(async (req, res) => {
  res.render("login", {
    title: "Đăng nhập",
    user: "",
  });
});

const register = catchAsync(async (req, res) => {
  res.render("register", {
    title: "Đăng ký",
    user: "",
  });
});

const forgot = catchAsync(async (req, res) => {
  res.render("forgotPassword", {
    title: "Quên mật khẩu",
  });
});

const resetPassword = catchAsync(async (req, res) => {
  res.render("resetPassword", {
    title: "Xác nhận",
    user: "",
  });
});

module.exports = {
  login,
  register,
  forgot,
  resetPassword,
};
