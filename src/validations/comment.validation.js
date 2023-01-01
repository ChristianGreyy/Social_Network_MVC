const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createComment = {
  body: Joi.object().keys({
    text: Joi.string().required(),
    author: Joi.string(),
    post: Joi.string().custom(objectId).required(),
    belong: Joi.string().custom(objectId),
  }),
};

const getComments = {
  query: Joi.object().keys({
    post: Joi.string().custom(objectId),
    comment: Joi.string().custom(objectId),
    populate: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getComment = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const updateComment = {
  params: Joi.object().keys({
    userId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      email: Joi.string().email(),
      password: Joi.string().custom(password),
      name: Joi.string(),
    })
    .min(1),
};

const deleteComment = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createComment,
  getComments,
  getComment,
  updateComment,
  deleteComment,
};
