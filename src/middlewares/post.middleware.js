const { Post, User } = require("../models");

exports.getFriendId = (req, res, next) => {
  if (!req.query.author) {
    const userIdArray = req.user.friends.map((friend) => {
      return friend.status == "friend" ? friend.user : null;
    });
    userIdArray.push(req.user._id);
    req.query.author = { $in: userIdArray };
  }
  next();
};

exports.viewGetRemoteUserImagePost = async (req, res, next) => {
  const posts = await Post.find({
    author: req.remoteUser.id,
    photo: {
      $ne: "undefined",
    },
  });
  req.imagePost = posts;
  next();
};
