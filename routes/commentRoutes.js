const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const { authMiddlware } = require("../auth/authMiddlware");

router.post("/", authMiddlware, commentController.createComment);
router.get("/", authMiddlware, commentController.getAllComments);
router.get("/:id", authMiddlware, commentController.getComment);
router.patch("/:id", authMiddlware, commentController.updateComment);
router.delete("/:id", authMiddlware, commentController.deleteComment);

module.exports = router;
