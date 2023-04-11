const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema(
  {
    post: {
      type: mongoose.Types.ObjectId,
      ref: "Post",
      required: [true, "Post is Required!"],
    },
    user: {
      type: Object,
      required: [true, "User is Required!"],
    },
    description: {
      type: String,
      required: [true, "Comment description is required"],
    },
  },
  {
    timestamps: true,
    id: false,
  }
);

module.exports = mongoose.model("Comment", commentSchema);
