const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const commentReplyLikeSchema = mongoose.Schema(
  {
    comment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CommentReply",
      required: true,
    },
    users_likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
commentReplyLikeSchema.plugin(toJSON);
commentReplyLikeSchema.plugin(paginate);

const commentReplyLike = mongoose.model(
  "commentReplyLike",
  commentReplyLikeSchema
);

module.exports = commentReplyLike;
