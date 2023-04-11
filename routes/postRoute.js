const express = require("express");
const router = express.Router();
const postController = require("../controllers/postController");
const { authMiddlware } = require("../auth/authMiddlware");
const {
  profilePhotoUpload,
  postImageResize,
} = require("../middlewares/uploads/profilePhoto");

router.post(
  "/",
  authMiddlware,
  profilePhotoUpload.single("image"),
  postImageResize,
  postController.createPost
);

router.get("/", postController.getAllPosts);
router.get("/:id", postController.getPost);

router.patch("/:id", authMiddlware, postController.updatePost);
router.delete("/:id", postController.deletePost);

router.put("/likes", authMiddlware, postController.increasePostLikes);
router.put("/dislikes", authMiddlware, postController.decreasePostLikes);

module.exports = router;
