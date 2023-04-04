const mongoose = require("mongoose");
const { User, Message, Post } = require("../models");

exports.apiGetFriendMessage = async (req, res, next) => {
  if (req.query.friend) {
    const messenger = await User.findOne({ slug: req.query.friend });
    req.query.$or = [
      {
        sender: req.user._id,
        receiver: messenger._id,
      },
      {
        receiver: req.user._id,
        sender: messenger._id,
      },
    ];
    return next();
  } else {
    const userIdArray = req.user.friends.map((friend) => {
      if (friend.status == "friend")
        return mongoose.Types.ObjectId(friend.user);
    });

    req.query.$or = [
      {
        sender: mongoose.Types.ObjectId(req.user.id),
        receiver: {
          $in: userIdArray,
        },
      },
      {
        sender: {
          $in: userIdArray,
        },
        receiver: mongoose.Types.ObjectId(req.user.id),
      },
    ];
  }
  return next();
};

exports.viewGetUnreadMessageNumber = async (req, res, next) => {
  if (req.path.includes("auth")) return next();
  let messages = await Message.find({
    $or: [
      {
        receiver: req.user.id,
      },
      {
        sender: req.user.id,
      },
    ],
  }).sort({ createdAt: -1 });

  let checkedUser = [];
  messages = messages.filter((msg) => {
    const messengerId = msg.receiver == req.user.id ? msg.sender : msg.receiver;
    if (!checkedUser.includes(messengerId.toString())) {
      checkedUser.push(messengerId.toString());
      return msg;
    }
  });

  let unReadNumber = messages.filter(
    (msg) => msg.read == false && msg.sender != req.user.id
  ).length;
  req.unReadNumber = unReadNumber;
  return next();
};
