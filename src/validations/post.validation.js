const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createPost = {
  body: Joi.object()
    .keys({
      content: Joi.string(),
      photo: Joi.string(),
      video: Joi.string(),
      author: Joi.string().required(),
    })
    .min(1),
};

const getPosts = {
  query: Joi.object().keys({
    content: Joi.string(),
    author: Joi.string(),
    slug: Joi.string(),
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
      content: Joi.string(),
      photo: Joi.string(),
      video: Joi.string(),
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
