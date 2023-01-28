const Joi = require("joi");
const { password, objectId } = require("./custom.validation");

const createMessage = {
  body: Joi.object().keys({
    text: Joi.string(),
    file: Joi.string(),
    roomId: Joi.string().custom(objectId),
    sender: Joi.string().custom(objectId).required(),
    receiver: Joi.string().custom(objectId).required(),
  }),
};

const getMessages = {
  query: Joi.object().keys({
    sender: Joi.string().custom(objectId),
    receiver: Joi.string().custom(objectId),
    friend: Joi.string(),
    populateFk: Joi.string(),
    populatePk: Joi.string(),
    sortBy: Joi.string(),
    limit: Joi.number().integer(),
    page: Joi.number().integer(),
  }),
};

const getMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

const updateMessage = {
  params: Joi.object().keys({
    messageId: Joi.required().custom(objectId),
  }),
  body: Joi.object()
    .keys({
      read: Joi.boolean(),
      text: Joi.string(),
    })
    .min(1),
};

const deleteMessage = {
  params: Joi.object().keys({
    messageId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
};
