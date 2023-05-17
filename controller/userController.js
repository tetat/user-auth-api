require("dotenv").config();
const jwt = require("jsonwebtoken");

const User = require("../models/User");

const tokenAge = 24 * 60 * 60;

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

// create token
const createToken = (userName) => {
  return jwt.sign({ userName }, process.env.JWT_SECRET, {
    expiresIn: tokenAge,
  });
};

module.exports.signup_get = (req, res) => {
  res.render("signup");
};

module.exports.login_get = (req, res) => {
  res.render("login");
};

module.exports.all_user = async (req, res) => {
  // _id, __v, & password is not allowed to access
  const users = await User.find({}).select({
    _id: 0,
    __v: 0,
    password: 0,
  });
  res.locals.users = users;
  res.render("users");
};

module.exports.sign_up = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: userName.trim(),
      email: email.trim(),
      password: password.trim(),
    });
    const token = createToken(user.userName);
    res.cookie("jwt", token, { httpOnly: true, maxAge: tokenAge * 1000 });
    res.status(201).json({ userName: user.userName });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.log_in = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email.trim(), password.trim());
    const token = createToken(user.userName);
    res.cookie("jwt", token, { httpOnly: true, maxAge: tokenAge * 1000 });
    res.status(201).json({ userName: user.userName });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};

module.exports.log_out = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
