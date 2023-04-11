const User = require("../models/userModal");
const { generateToken } = require("../token/generateToken");
const { validateMongoID } = require("../utils/validateId");
const nodemailer = require("nodemailer");
const crypto = require("crypto");
const { cloudinaryUploadImg } = require("../utils/cloudinary");
const fs = require("fs");

exports.registerUser = async (req, res) => {
  const existingEmail = await User.findOne({ email: req?.body?.email });

  try {
    if (existingEmail) {
      return res.status(400).json({
        status: "fail",
        message: "Email Already Exist",
      });
    }

    const user = await User.create({
      firstName: req?.body?.firstName,
      lastName: req?.body?.lastName,
      email: req?.body?.email,
      password: req?.body?.password,
    });

    res.status(201).json({
      status: "success",
      result: 1,
      data: {
        user: user,
      },
    });
  } catch (error) {
    res.status(400).json({
      status: "fail",
      message: err.message,
    });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const user = await User.findOne({ email: req?.body?.email });

    if (user && (await user.isPasswordMatched(req.body.password || ""))) {
      const { firstName, lastName, email, profileImage, isAdmin } = user;
      return res.status(200).json({
        status: "success",
        data: {
          user: {
            firstName,
            lastName,
            email,
            profileImage,
            isAdmin,
            token: generateToken(user._id),
          },
        },
      });
    } else {
      return res.status(400).json({
        status: "fail",
        message: "Invalid User Credential!",
      });
    }
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(400).json({
        status: "fail",
        message: "No User Find with this ID",
      });
    }

    res.status(204).json({
      status: "success",
      data: null,
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  const { id } = req.params;

  if (!validateMongoID(id)) {
    return res.status(400).json({
      status: "fail",
      message: "Invalid ID",
    });
  } else {
    try {
      const user = await User.findById(id);

      if (!user) {
        return res.status(400).json({
          status: "fail",
          message: "No User Find with this ID",
        });
      }

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
};

exports.userProfile = async (req, res) => {
  const { id } = req.params;
  if (!validateMongoID(id)) {
    return res.status(400).json({
      status: "fail",
      message: "No User Find with this ID",
    });
  } else {
    try {
      const user = await User.findById(id).populate("posts");

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
};

exports.updateUserProfile = async (req, res) => {
  if (!validateMongoID(req.user._id.toString())) {
    return res.status(400).json({
      status: "fail",
      message: "No User Find with this ID",
    });
  } else {
    try {
      const userID = req.user._id.toString();
      const user = await User.findByIdAndUpdate(
        userID,
        {
          firstName: req?.body?.firstName,
          lastName: req?.body?.lastName,
          email: req?.body?.email,
        },
        {
          new: true,
          runValidators: true,
        }
      );

      res.status(200).json({
        status: "success",
        data: {
          user,
        },
      });
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
};

exports.updateUserPassword = async (req, res) => {
  if (!validateMongoID(req.user._id.toString())) {
    return res.status(400).json({
      status: "fail",
      message: "No User Find with this ID",
    });
  } else {
    try {
      if (req.body.password) {
        const userID = req.user._id.toString();
        const user = await User.findById(userID);

        user.password = req?.body?.password;

        const updatedUser = await user.save();

        res.status(200).json({
          status: "success",
          data: {
            user: updatedUser,
          },
        });
      } else {
        return res.status(400).json({
          status: "fail",
          message: "No Password Specified",
        });
      }
    } catch (error) {
      res.status(500).json({
        status: "fail",
        message: error.message,
      });
    }
  }
};

exports.followingUser = async (req, res) => {
  const { followID } = req.body;
  const loginUserID = req.user._id.toString();

  const targetedUser = await User.findById(followID);
  const targetedUserFollowers = [...targetedUser.followers].map((currElem) => {
    return currElem.toString();
  });

  if (targetedUserFollowers.includes(loginUserID.toString())) {
    return res.status(200).json({
      status: "success",
      message: "You've already Followed this User",
    });
  }
  // Update Follower List of Who You've Followed
  const FollowedUser = await User.findByIdAndUpdate(
    followID,
    {
      $push: { followers: loginUserID },
      isFollowing: true,
    },
    {
      new: true,
    }
  );

  // Update Login User Following
  const loginUser = await User.findByIdAndUpdate(
    loginUserID,
    {
      $push: { following: followID },
    },
    {
      new: true,
    }
  );

  res.json(`You've SuccessFully Followed `);
};

exports.unFollowUser = async (req, res) => {
  const { unFollowID } = req.body;
  const loginUserID = req.user._id.toString();

  await User.findByIdAndUpdate(
    unFollowID,
    {
      $pull: { followers: loginUserID },
      isFollowing: false,
    },
    {
      new: true,
    }
  );

  await User.findByIdAndUpdate(
    loginUserID,
    {
      $pull: { following: unFollowID },
      isFollowing: false,
    },
    {
      new: true,
    }
  );

  res.json(`You've SuccessFully UnFollowed User`);
};

exports.blockUser = async (req, res) => {
  const { id } = req.params;

  if (!validateMongoID(id)) {
    return res.status(400).json({
      status: "fail",
      message: "No User Find with this ID",
    });
  } else {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: true,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
};

exports.unblockUser = async (req, res) => {
  const { id } = req.params;

  if (!validateMongoID(id)) {
    return res.status(400).json({
      status: "fail",
      message: "No User Find with this ID",
    });
  } else {
    const user = await User.findByIdAndUpdate(
      id,
      {
        isBlocked: false,
      },
      {
        new: true,
      }
    );

    res.status(200).json({
      status: "success",
      data: {
        user,
      },
    });
  }
};

exports.generateVerificationToken = async (req, res) => {
  const loginUserID = req.user._id.toString();

  const user = await User.findById(loginUserID);

  try {
    const verificationToken = await user.createAccountVerificationToken();

    await user.save();

    const resetURL = `<a href="http://localhost:5173/verify-account?token=${verificationToken}" target="_blank">Verify Your Account</a>`;

    const transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "tamia52@ethereal.email",
        pass: "NUbHQCfZcfFDd3NdC2",
      },
    });

    let info = await transporter.sendMail({
      from: '"Blog Application 👻" <blogapplication@blogapplication.com>',
      to: "paritbhardwaj@outlook.com",
      subject: "Account Verification Email ✔️",
      html: resetURL,
    });

    res.json({
      status: "success",
      message: "Email Sent ✔️",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }
};

exports.verifyAccount = async (req, res) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find this User By Token
  const user = await User.findOne({
    accountVerificationToken: hashedToken,
    accountVerificationTokenExpiry: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token Expire!",
    });
  }

  user.isAccountVerified = true;
  user.accountVerificationToken = undefined;
  user.accountVerificationTokenExpiry = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.forgetPasswordToken = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    return res.status(400).json({
      status: "success",
      message: "User not Found!",
    });
  }

  try {
    const token = await user.createResetPasswordToken();
    await user.save();

    const resetURL = `<a href="http://localhost:5173/reset-password?token=${token}" target="_blank">Reset Your Passowd</a>`;

    const transporter = await nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: "tamia52@ethereal.email",
        pass: "NUbHQCfZcfFDd3NdC2",
      },
    });

    let info = await transporter.sendMail({
      from: '"Blog Application 👻" <blogapplication@blogapplication.com>',
      to: email,
      subject: "Reset Your Password ✔️",
      html: resetURL,
    });

    res.status(200).json({
      status: "success",
      message: "Email Sent ✔️",
    });
  } catch (error) {
    res.status(500).json({
      status: "fail",
      message: error.message,
    });
  }

  // const user = await res.send("Forgot Password");
};

exports.verifyPasswordResetToken = async (req, res) => {
  const { token, password } = req.body;
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  // Find this User By Token
  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetToken: { $gt: new Date() },
  });

  if (!user) {
    return res.status(400).json({
      status: "fail",
      message: "Token Expire!",
    });
  }

  user.password = password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: "success",
    data: {
      user,
    },
  });
};

exports.uploadProfilePhoto = async (req, res) => {
  const loginUserID = req.user._id.toString();

  const localpath = `public/images/profile/${req.file.filename}`;

  const imageUploaded = await cloudinaryUploadImg(localpath);

  const foundUser = await User.findByIdAndUpdate(
    loginUserID,
    {
      profileImage: imageUploaded.secure_url,
    },
    {
      new: true,
    }
  );

  fs.unlinkSync(localpath);
  res.json({
    status: "success",
    data: {
      user: foundUser,
    },
  });
};
