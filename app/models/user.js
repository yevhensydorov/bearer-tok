const mongoose = require("mongoose");

const userScheme = mongoose.Schema({
  local: {
    username: String,
    password: String
  }
});

module.exports = mongoose.model("User", userScheme);
