const Post = require("../models/postModal");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const { validateMongoID } = require("../utils/validateId");
const fs = require("fs");

exports.createPost = async (req, res) => {
  const loginUserID = req.user._id.toString();

  if (!validateMongoID(loginUserID)) {
    return res.status(200).json({
      status: "success",
      message: "User ID is not valid!",
    });
  }
  const localPath = `public/images/posts/${req.file.filename}`;
  const imageUploaded = await cloudinaryUploadImg(localPath);

  try {
    const post = await Post.create({
      ...req.body,
      image: imageUploaded.secure_url,
      user: loginUserID,
    });
    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
    fs.unlinkSync(localPath);
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("user");
    res.status(200).json({
      status: "success",
      results: posts.length,
      data: {
        posts,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getPost = async (req, res) => {
  const { id } = req.params;

  if (!validateMongoID(id)) {
    return res.status(200).json({
      status: "success",
      message: "Post ID is not valid!",
    });
  }

  try {
    const post = await Post.findById(id)
      .populate("user")
      .populate("disLikes")
      .populate("likes");

    await Post.findByIdAndUpdate(
      id,
      {
        $inc: { numViews: 1 },
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updatePost = async (req, res) => {
  const { id } = req.params;
  const loginUserID = req.user._id.toString();

  if (!validateMongoID(id)) {
    return res.status(200).json({
      status: "success",
      message: "Post ID is not valid!",
    });
  }

  try {
    const post = await Post.findByIdAndUpdate(
      id,
      { ...req.body, user: loginUserID },
      {
        runValidators: true,
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deletePost = async (req, res) => {
  const { id } = req.params;

  if (!validateMongoID(id)) {
    return res.status(200).json({
      status: "success",
      message: "Post ID is not valid!",
    });
  }

  try {
    const post = await Post.findByIdAndDelete(id);

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.increasePostLikes = async (req, res) => {
  const { postID } = req.body;
  const loginUserID = req.user._id.toString();

  const post = await Post.findById(postID);

  const disLikes = [...post.disLikes].map((currElem) => {
    return currElem.toString();
  });

  const alreadyDisliked = disLikes.includes(loginUserID);

  if (alreadyDisliked) {
    const post = await Post.findByIdAndUpdate(
      postID,
      {
        $pull: { disLikes: loginUserID },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );
  }

  if (post.isLiked) {
    const post = await Post.findByIdAndUpdate(
      postID,
      {
        $pull: { likes: loginUserID },
        isLiked: false,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } else {
    const post = await Post.findByIdAndUpdate(
      postID,
      {
        $push: { likes: loginUserID },
        isLiked: true,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
};

exports.decreasePostLikes = async (req, res) => {
  const { postID } = req.body;
  const loginUserID = req.user._id.toString();

  const post = await Post.findById(postID);

  const likes = [...post.likes].map((currElem) => {
    return currElem.toString();
  });

  const alreadyLiked = likes.includes(loginUserID);

  if (alreadyLiked) {
    const post = await Post.findByIdAndUpdate(
      postID,
      {
        $pull: { likes: loginUserID },
        isLiked: false,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  }

  if (post.isDisLiked) {
    const post = await Post.findByIdAndUpdate(
      postID,
      {
        $pull: { disLikes: loginUserID },
        isDisLiked: false,
      },
      {
        new: true,
      }
    );

    return res.status(200).json({
      status: "success",
      data: {
        post,
      },
    });
  } else {
    const post = await Post.findByIdAndUpdate(
      postID,
      {
        $push: { disLikes: loginUserID },
        isDisLiked: true,
      },
      {
        new: true,
      }
    );
  }

  res.status(200).json({
    status: "success",
    data: {
      post,
    },
  });
};
