const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const { toJSON, paginate } = require("./plugins");
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
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
postSchema.plugin(toJSON);
postSchema.plugin(paginate);

/**
 * @typedef User
 */
const Post = mongoose.model("Post", postSchema);

module.exports = Post;
