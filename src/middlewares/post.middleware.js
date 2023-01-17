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
