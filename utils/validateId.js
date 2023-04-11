const mongoose = require("mongoose");

exports.validateMongoID = (id) => {
  const isUser = mongoose.Types.ObjectId.isValid(id);
  return isUser;
};
