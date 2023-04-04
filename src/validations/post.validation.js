const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createPost = {
  body: Joi.object()
    .keys({
      content: Joi.string(),
      photo: Joi.string(),
      video: Joi.string(),
      author: Joi.string(),
    })
    .min(1),
};
const getPosts = {
  query: Joi.object().keys({
    _id: Joi.custom(objectId),
    content: Joi.string(),
    author: Joi.string(),
    populateFk: Joi.string(),
    populatePk: Joi.string(),
    friends: Joi.boolean(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getPost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

const updatePost = {
  params: Joi.object().keys({
    postId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      id: Joi.required().custom(objectId),
      author: Joi.required().custom(objectId),
      content: Joi.string(),
      photo: Joi.string(),
      video: Joi.string(),
      likes: Joi.array().items(Joi.custom(objectId)),
      shares: Joi.array().items(Joi.custom(objectId)),
      createdAt: Joi.string(),
      updatedAt: Joi.string(),
    })
    .min(1),
};

const deletePost = {
  params: Joi.object().keys({
    postId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
};
