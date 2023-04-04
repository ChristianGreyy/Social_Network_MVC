const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate, paginateAggregrate } = require("./plugins");

const { roles } = require("../config/roles");
const notificationSchema = mongoose.Schema(
  {
    sender: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    type: {
      type: String,
      enum: ["friend", "like", "comment", "follow"],
    },
    post: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
    read: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
notificationSchema.plugin(toJSON);
notificationSchema.plugin(paginateAggregrate);

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
