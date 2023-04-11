const Comment = require("../models/commentModal");

exports.createComment = async (req, res) => {
  const { postID } = req.body;

  try {
    const comment = await Comment.create({
      ...req.body,
      user: req.user,
      post: postID,
    });

    res.json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find().sort("-createdAt");
    res.json({
      status: "success",
      result: comments.length,
      data: {
        comments,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findById(id);
    res.json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.updateComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndUpdate(
      id,
      {
        description: req.body.description,
      },
      {
        new: true,
      }
    );

    res.json({
      status: "success",
      data: {
        comment,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteComment = async (req, res) => {
  const { id } = req.params;
  try {
    const comment = await Comment.findByIdAndDelete(id);
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
