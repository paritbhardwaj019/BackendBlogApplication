const Category = require("../models/categoryModal");

exports.createCategory = async (req, res) => {
  const loginUserID = req.user._id.toString();
  try {
    const category = await Category.create({
      user: loginUserID,
      title: req.body.title,
    });
    res.status(201).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find()
      .populate("user")
      .sort("-createdAt");

    res.status(201).json({
      status: "success",
      result: categories.length,
      data: {
        categories,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.editCategrory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndUpdate(
      id,
      {
        title: req?.body?.title,
      },
      {
        new: true,
      }
    );
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findByIdAndDelete(id);
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

exports.getSingleCategory = async (req, res) => {
  const { id } = req.params;
  try {
    const category = await Category.findById(id);
    res.status(200).json({
      status: "success",
      data: {
        category,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: error.message,
    });
  }
};
