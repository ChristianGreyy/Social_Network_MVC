exports.getFriendId = (req, res, next) => {
  const userIdArray = req.user.friends;
  req.userIdArray = userIdArray;
  next();
};
