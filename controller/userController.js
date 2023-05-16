const User = require("../models/User");

module.exports.all_user = async (req, res) => {
  try {
    const users = await User.find({});
    res.status(201).json({ users });
  } catch (err) {
    res.status(400).send("Users not found");
  }
};

module.exports.sign_up = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    const user = await User.create({
      firstName: firstName.trim(),
      lastName: lastName.trim(),
      userName: userName.trim(),
      email,
      password,
    });
    res.status(201).json({ user });
  } catch (err) {
    res.status(400).json({ message: "User not created" });
  }
};
