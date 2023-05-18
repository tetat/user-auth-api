const { all_user, createToken, handleErrors } = require("../hooks/userHooks");
const User = require("../models/User");

const tokenAge = 24 * 60 * 60;

module.exports.users = async (req, res) => {
  const users = await all_user();
  res.status(201).json(users);
};

module.exports.user = async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findOne({ userName }).select({
    _id: 0,
    __v: 0,
    password: 0,
  });
  if (user) {
    res.status(201).json(user);
  } else {
    res.status(400).json({ userName: "user name not valid" });
  }
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

module.exports.delete_user = async (req, res) => {
  const userName = req.params.userName;
  const user = await User.deleteOne({ userName });
  if (user.deletedCount) {
    res.cookie("jwt", "", { maxAge: 1 });
  }
  res.status(201).json({ user });
};
