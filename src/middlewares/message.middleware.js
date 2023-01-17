const mongoose = require("mongoose");
const { User } = require("../models");

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
