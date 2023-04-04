const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate, paginateAggregrate } = require("./plugins");

const { roles } = require("../config/roles");
const messageSchema = mongoose.Schema(
  {
    roomId: { type: mongoose.Schema.Types.ObjectId },
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    text: {
      type: String,
      trim: true,
      minlength: 1,
    },
    photo: String,
    video: String,
    document: { type: mongoose.Schema.Types.ObjectId, ref: "Document" },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
messageSchema.plugin(toJSON);
messageSchema.plugin(paginateAggregrate);

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
