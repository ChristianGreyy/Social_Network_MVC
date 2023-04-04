const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createUser = {
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().custom(password),
    name: Joi.string().required(),
    role: Joi.string().required().valid("user", "admin"),
  }),
};
const getUsers = {
  query: Joi.object().keys({
    name: Joi.string(),
    slug: Joi.string(),
    status: Joi.string(),
    role: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateUser = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      id: Joi.custom(objectId),
      _id: Joi.custom(objectId),
      email: Joi.string().email(),
      file: Joi.string(),
      avatar: Joi.string(),
      introduction: Joi.string(),
      background: Joi.string(),
      friends: Joi.array(),
      followers: Joi.array(),
      followings: Joi.array(),
      createdAt: Joi.string(),
      firstName: Joi.string(),
      lastName: Joi.string(),
      phoneNumber: Joi.string(),
      address: Joi.string(),
      country: Joi.string(),
      hobbies: Joi.string(),
      gender: Joi.string(),
      education: Joi.string(),
      day: Joi.string(),
      month: Joi.string(),
      year: Joi.string(),
      occupation: Joi.string(),
      slug: Joi.string(),
      role: Joi.string(),
      createdAt: Joi.string(),
      updatedAt: Joi.string(),
      postsNumber: Joi.number(),
    })
    .min(1),
};

const deleteUser = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createUser,
  getUsers,
  getUser,
  updateUser,
  deleteUser,
};
