const express = require("express");
const router = express.Router();
const userControllers = require("../controllers/userControllers");
const { authMiddlware } = require("../auth/authMiddlware");
const {
  profilePhotoUpload,
  profilePhotoResize,
} = require("../middlewares/uploads/profilePhoto");

router.post("/register", userControllers.registerUser);
router.post("/login", userControllers.loginUser);
router.get("/users", authMiddlware, userControllers.getAllUsers);

router.delete("/:id", userControllers.deleteUser);
router.get("/:id", userControllers.getUser);

router.get("/profile/:id", authMiddlware, userControllers.userProfile);
router.patch("/:id", authMiddlware, userControllers.updateUserProfile);
router.put(
  "/updatePassword",
  authMiddlware,
  userControllers.updateUserPassword
);

router.put("/follow", authMiddlware, userControllers.followingUser);
router.put("/unfollow", authMiddlware, userControllers.unFollowUser);

router.put("/block-user/:id", authMiddlware, userControllers.blockUser);
router.put("/unblock-user/:id", authMiddlware, userControllers.unblockUser);

router.post(
  "/generate-verify-email",
  authMiddlware,
  userControllers.generateVerificationToken
);

router.put("/verify-account", authMiddlware, userControllers.verifyAccount);

router.put("/forget-password-token", userControllers.forgetPasswordToken);
router.put("/change-password", userControllers.verifyPasswordResetToken);

router.put(
  "/profile-upload",
  authMiddlware,
  profilePhotoUpload.single("image"),
  profilePhotoResize,
  userControllers.uploadProfilePhoto
);

module.exports = router;
