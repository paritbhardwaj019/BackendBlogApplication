const express = require("express");
const router = express.Router();
const categoryController = require("../controllers/categoryController");
const { authMiddlware } = require("../auth/authMiddlware");

router.post("/", authMiddlware, categoryController.createCategory);
router.get("/", authMiddlware, categoryController.getAllCategories);
router.put("/:id", authMiddlware, categoryController.editCategrory);
router.get("/:id", authMiddlware, categoryController.getSingleCategory);
router.delete("/:id", authMiddlware, categoryController.deleteCategory);

module.exports = router;
