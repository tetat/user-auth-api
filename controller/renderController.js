const { all_user } = require("../hooks/userHooks");

module.exports.sign_up = (req, res) => {
  res.render("signup");
};

module.exports.log_in = (req, res) => {
  res.render("login");
};

module.exports.demo = async (req, res) => {
  const users = await all_user();
  res.locals.users = users;
  res.render("demo");
};

module.exports.log_out = (req, res) => {
  res.cookie("jwt", "", { maxAge: 1 });
  res.redirect("/");
};
