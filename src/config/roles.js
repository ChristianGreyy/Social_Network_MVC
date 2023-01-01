const allRoles = {
  user: ["getPosts"],
  admin: ["manageUser"],
};

const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));

module.exports = {
  roles,
  roleRights,
};
