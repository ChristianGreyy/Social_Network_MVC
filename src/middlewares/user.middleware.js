const { Post, User } = require("../models");
const socket = require("../config/socket");

exports.viewGetRemoteUser = async (req, res, next) => {
  let user = await User.findOne({ slug: req.params.slug }).select(
    "-password -isEmailVerified -role -__v"
  );

  // console.log("PATH", req.path);

  if (!user) {
    user = req.user;
  }
  // console.log("remoteUser:", user);

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
        // user is author and user is like user'post
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
  // console.log(userOnline);
  if (req.query.status == "onlineFriend") {
    const userIdArray = req.user.friends.map((friend) => {
      if (
        friend.status == "friend" &&
        userOnline.find((user) => user.userId == friend.user)
      )
        return friend.user;
    });
    // console.log(userIdArray);
    req.query._id = userIdArray;
  }
  next();
};
