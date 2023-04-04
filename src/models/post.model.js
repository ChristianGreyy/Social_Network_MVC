const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate, paginateAggregrate } = require("./plugins");
const { roles } = require("../config/roles");
const postSchema = mongoose.Schema(
  {
    content: {
      type: String,
    },
    photo: {
      type: String,
    },
    video: {
      type: String,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],
    // comments: [
    //   {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "Comment",
    //     required: true,
    //   },
    // ],
    shares: [
      {
        type: String,
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
postSchema.plugin(toJSON);
postSchema.plugin(paginateAggregrate);

/**
 * @typedef User
 */
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
