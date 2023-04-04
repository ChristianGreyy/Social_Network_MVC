const { Post, User } = require("../models");
const socket = require("../config/socket");

exports.viewGetRemoteUser = async (req, res, next) => {
  let user = await User.findOne({ slug: req.params.slug }).select(
    "-password -isEmailVerified -role -__v"
  );
  if (!user) {
    user = req.user;
  }
  const posts = await Post.find({ author: user._id });
  user._doc.postsNumber = posts.length;
  user._doc.id = user._id;
  req.remoteUser = user._doc;
  return next();
};

exports.viewGetLikesTotal = async (req, res, next) => {
  const posts = await Post.find({ author: req.remoteUser.id })
    .populate("likes")
    .sort({
      createdAt: -1,
    });
  const likedUsers = [];
  const likesTotal = posts.reduce((result, post) => {
    result += post.likes.length;

    post.likes.forEach((likedUser) => {
      if (
        likedUsers.findIndex((user) => {
          return user._id.toString() == likedUser._id.toString();
        }) == -1
      ) {
        if (
          !(
            post.author.toString() == req.user.id.toString() &&
            likedUser._id == req.user.id
          )
        ) {
          likedUsers.push(likedUser);
        }
      }
    });

    return result;
  }, 0);
  console.log(likedUsers);
  req.likesTotal = likesTotal;
  req.likedUsers = likedUsers;

  next();
};

exports.apiGetRequestfriend = async (req, res, next) => {
  if (req.query.status == "request") {
    const userIdArray = req.user.friends.map((friend) => {
      if (friend.status == "stranger") return friend.user;
    });
    req.query._id = userIdArray;
  }
  next();
};

exports.apiGetfriend = async (req, res, next) => {
  if (req.query.status == "friend") {
    const userIdArray = req.user.friends.map((friend) => {
      if (friend.status == "friend") return friend.user;
    });
    req.query._id = userIdArray;
  }
  next();
};

exports.apiGetOnlinefriend = async (req, res, next) => {
  const userOnline = socket.getOnlineUser();
  if (req.query.status == "onlineFriend") {
    const userIdArray = req.user.friends.map((friend) => {
      if (
        friend.status == "friend" &&
        userOnline.find((user) => user.userId == friend.user)
      )
        return friend.user;
    });
    req.query._id = userIdArray;
  }
  next();
};
