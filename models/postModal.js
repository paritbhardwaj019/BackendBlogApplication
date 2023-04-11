const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Title should be present in Post"],
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Post Category should be present in Post"],
      default: "All",
    },
    isLiked: {
      type: Boolean,
      default: false,
    },
    isDisLiked: {
      type: Boolean,
      default: false,
    },
    numViews: {
      type: Number,
      default: 0,
    },
    likes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    disLikes: [
      {
        type: mongoose.Types.ObjectId,
        ref: "User",
      },
    ],
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: [true, "User Author is required"],
    },
    description: {
      type: String,
      require: [true, "description is required in Post"],
    },
    image: {
      type: String,
      default:
        "https://cdn.pixabay.com/photo/2015/06/24/15/45/code-820275_960_720.jpg",
    },
  },
  {
    toJSON: {
      virtuals: true,
    },
    toObject: {
      virtuals: true,
    },
    timestamps: true,
    id: false,
  }
);

module.exports = mongoose.model("Post", postSchema);
