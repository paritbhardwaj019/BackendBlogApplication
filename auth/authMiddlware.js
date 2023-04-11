const jwt = require("jsonwebtoken");
const User = require("../models/userModal");

exports.authMiddlware = async (req, res, next) => {
  let token;

  if (req?.headers?.authorization?.startsWith("Bearer")) {
    try {
      token = req.headers.authorization.split(" ")[1];
      if (token) {
        const decodedToken = jwt.verify(token, process.env.JWT_KEY);

        const user = await User.findById(decodedToken.id).select(
          "-password -__v"
        );

        req.user = user;

        next();
      }
    } catch (error) {
      res.status(401).json({
        status: "fail",
        message: "Not authorized, Login Again!",
      });
    }
  } else {
    res.status(400).json({
      status: "fail",
      message: "Token Not Found!",
    });
  }
};
