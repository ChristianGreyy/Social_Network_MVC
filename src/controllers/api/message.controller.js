const httpStatus = require("http-status");
const pick = require("../../utils/pick");
const ApiError = require("../../utils/ApiError");
const catchAsync = require("../../utils/catchAsync");
const { messageService, documentService } = require("../../services");
const socket = require("../../config/socket");

const createMessage = catchAsync(async (req, res) => {
  if (req.file) {
    req.body[req.storeFile] = `/resources/${req.storeFile + "s"}/`.concat(
      req.file.path.split("/")[req.file.path.split("/").length - 1]
    );
    if (req.storeFile == "document") {
      const newDocument = await documentService.createDocument({
        originalName: req.file.originalname,
        mimeType: req.file.mimetype,
        path: req.body[req.storeFile],
        size: req.file.size,
      });
      req.body[req.storeFile] = newDocument._id;
    }
  }
  const message = await messageService.createMessage(req.body);
  const messengerId = message.results[0].receiver[0]._id;
  const userOnline = socket.getOnlineUser();
  const onlineMessenger = userOnline.find((user) => {
    return user.userId == messengerId;
  });

  socket.getIo().to(onlineMessenger?.socketId).emit("getNewMessage", message);
  res.status(httpStatus.CREATED).send(message);
});

const getMessages = catchAsync(async (req, res) => {
  const filter = pick(req.query, ["$or"]);
  const options = pick(req.query, [
    "sortBy",
    "limit",
    "page",
    "populate",
    "populateFk",
    "populatePk",
  ]);
  const result = await messageService.queryMessages(filter, options);
  res.send(result);
});

const getMessage = catchAsync(async (req, res) => {
  const message = await messageService.getMessageById(req.params.messageId);
  if (!message) {
    throw new ApiError(httpStatus.NOT_FOUND, "Message not found!");
  }
  res.send(message);
});

const updateMessage = catchAsync(async (req, res) => {
  const message = await messageService.updateMessageById(
    req.params.messageId,
    req.body
  );
  res.send(message);
});

const deleteMessage = catchAsync(async (req, res) => {
  await messageService.deleteMessageById(req.params.messageId);
  res.status(httpStatus.NO_CONTENT).send();
});

module.exports = {
  createMessage,
  getMessages,
  getMessage,
  updateMessage,
  deleteMessage,
};
