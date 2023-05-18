require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const tokenAge = 24 * 60 * 60;

const all_user = async () => {
  // _id, __v, & password is not allowed to access
  const users = await User.find({}).select({
    _id: 0,
    __v: 0,
    password: 0,
  });
  return users;
};

// create token
const createToken = (userName) => {
  return jwt.sign({ userName }, process.env.JWT_SECRET, {
    expiresIn: tokenAge,
  });
};

const handleErrors = (err) => {
  const errors = {};

  // login errors section //
  if (err.message === "incorrect email") {
    errors.email = "That email is not registered";
  }
  if (err.message === "incorrect password") {
    errors.password = "That password is incorrect";
  }

  // signup errors section //
  // duplicate errors
  if (err.code === 11000) {
    errors.email = "That email is already registered";
    return errors;
  }

  // validation errors
  if (err.message.includes("user validation failed")) {
    Object.values(err.errors).forEach(({ properties }) => {
      errors[properties.path] = properties.message;
    });
  }

  return errors;
};

module.exports = {
  all_user,
  handleErrors,
  createToken,
};
