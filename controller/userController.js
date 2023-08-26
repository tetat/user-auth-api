const { all_user, createToken, handleErrors } = require("../hooks/userHooks");
const User = require("../models/User");

const tokenAge = 24 * 60 * 60;

// create and store user in db. method: POST
module.exports.sign_up = async (req, res) => {
  const { firstName, lastName, userName, email, password } = req.body;

  try {
    const user = await User.create({
      firstName,
      lastName,
      userName,
      email,
      password,
    });
    const token = createToken(user.userName);
    res.cookie("jwt", token, { httpOnly: true, maxAge: tokenAge * 1000 });
    res.status(201).json({ userName: user.userName });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
// login user. method: POST
module.exports.log_in = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email, password);
    const token = createToken(user.userName);
    res.cookie("jwt", token, { httpOnly: true, maxAge: tokenAge * 1000 });
    res.status(201).json({ userName: user.userName });
  } catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
};
// log out. method: GET
module.exports.log_out = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};

// get all users. method: GET
module.exports.users = async (req, res) => {
  const users = await all_user();
  res.status(201).json(users);
};
// get a user with userName. method: GET
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
// update a user info. method: PATCH
module.exports.update_user = async (req, res) => {
  if (req.body) {
    const updates = req.body;
    if (updates.email || updates.password) {
      res
        .status(403)
        .json({ error: "updating email & password is not allowed" });
    } else {
      const result = await User.updateOne(
        { userName: req.params.userName },
        { $set: updates }
      );
      console.log(result);
      res.status(201).json({ result });
    }
  }
};
// delete a user from db. method: DELETE
module.exports.delete_user = async (req, res) => {
  const userName = req.params.userName;
  const result = await User.deleteOne({ userName });
  if (result.deletedCount) {
    res.cookie("jwt", "", { maxAge: 1 });
  }
  res.status(201).json({ result });
};
