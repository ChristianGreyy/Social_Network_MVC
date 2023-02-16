const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { userService, notificationService } = require("../../services");
const { User, Notification } = require("../../models");
const socket = require("../../config/socket");

const createUser = catchAsync(async (req, res) => {
  const user = await userService.createUser(req.body);
  res.status(httpStatus.CREATED).send(user);
});

const getUsers = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["name", "role", "_id", "slug"]);
  const options = pick(req.query, ["sortBy", "limit", "page"]);
  const result = await userService.queryUsers(filter, options);
  res.send(result);
});

const getUser = catchAsync(async (req, res) => {
  const user = await userService.getUserById(req.params.userId);
  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "User not found");
  }
  res.send(user);
});

const updateUser = catchAsync(async (req, res) => {
  const userOnline = socket.getOnlineUser();
  // Solve socket to new friend
  if (Object.keys(req.body).length && req.body.friends) {
    const remoteUser = await User.findOne({ _id: req.params.userId });
    console.log(req.body.friends);
    if (remoteUser.friends.length < req.body.friends.length) {
      let friendItem = req.body.friends[req.body.friends.length - 1];
      let remoteUserSocket = userOnline.find(
        (user) => user.userId == req.params.userId
      );
      // remoteUser is online
      if (remoteUserSocket) {
        // User send friend request to remoteUser
        if (friendItem.status == "stranger") {
          console.log("stranger");
          const strangerFriendRemoteUser = remoteUser.friends.filter(
            (friend) => friend.status == "stranger"
          );
          const strangerLength = strangerFriendRemoteUser.length;
          socket
            .getIo()
            .to(remoteUserSocket.socketId)
            .emit("addNewFriendRequest", {
              user: req.user,
              strangerLength: strangerLength + 1,
            });
        } // User accept remoteUser's friend request
        else if (friendItem.status == "friend") {
          console.log("friend");

          const remoteUserNotiLength = await Notification.countDocuments({
            receiver: req.params.userId,
            read: false,
          });

          await notificationService.createNotification({
            sender: req.user.id,
            receiver: remoteUser.id,
            type: "friend",
            read: false,
          });

          console.log(remoteUserNotiLength + 1);
          socket
            .getIo()
            .to(remoteUserSocket.socketId)
            .emit("addNewFriend", {
              user: req.user,
              remoteUserNotiLength: remoteUserNotiLength + 1,
            });
        }
      }
    }
    // User remove remoteUser' request friend || friend
    else if (remoteUser.friends.length > req.body.friends.length) {
      console.log("remove");
      let remoteUserSocket = userOnline.find(
        (user) => user.userId == req.params.userId
      );
      if (remoteUserSocket) {
        socket
          .getIo()
          .to(remoteUserSocket.socketId)
          .emit("removeFriendRequestOrFriend", {
            user: req.user,
          });
      }
    }
  }

  // Sovle udpate avatar
  if (req.file) {
    req.body["avatar"] = `/resources/${req.storeFile + "s"}/`.concat(
      req.file.path.split("/")[req.file.path.split("/").length - 1]
    );
  }
  const user = await userService.updateUserById(req.params.userId, req.body);
  // socket.getIo().emit("get", user);

  res.send(user);
});

const deleteUser = catchAsync(async (req, res) => {
  await userService.deleteUserById(req.params.userId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
