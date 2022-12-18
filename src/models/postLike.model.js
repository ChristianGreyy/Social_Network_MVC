const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
const { roles } = require("../config/roles");

const PostLikeSchema = mongoose.Schema(
  {
    post: {
      type: mongoose.SChema.Types.ObjectId,
      required: true,
      ref: "Post",
    },
    users_likes: [
      {
        type: mongoose.SChema.Types.ObjectId,
        required: true,
        ref: "User",
      },
    ],
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
PostLikeSchema.plugin(toJSON);
PostLikeSchema.plugin(paginate);

const PostLike = mongoose.model("PostLike", PostLikeSchema);

module.exports = PostLike;
